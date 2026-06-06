import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export type PeriodoCedente = '1m' | '3m' | '6m' | 'ytd' | 'all';

export interface PipelineCedente {
  PUBLICADA: number;
  OFERTADA: number;
  FINANCIADA: number;
  PENDIENTE_VERIFICACION_PAGO: number;
}

export interface KpiVariacion {
  valor: number;
  porcentaje: number | null;
}

export interface KpisCedente {
  capitalPorRecibir: number;
  capitalRecibido: KpiVariacion;
  costoPromedioFinanciamiento: KpiVariacion;
  tiempoPromedioFinanciamiento: KpiVariacion;
}

export interface FacturaEnRiesgo {
  id: string;
  folio: string;
  razonSocial: string;
  diasVencimiento: number;
  monto: number;
}

export interface AlertaRiesgo {
  facturas: FacturaEnRiesgo[];
  diasUmbral: number;
}

export interface DashboardCedenteState {
  periodo: PeriodoCedente;
  pipeline: PipelineCedente | null;
  kpis: KpisCedente | null;
  alerta: AlertaRiesgo | null;
  cargandoPipeline: boolean;
  cargandoKpis: boolean;
  errorPipeline: string | null;
  errorKpis: string | null;
}

const ESTADO_INICIAL: DashboardCedenteState = {
  periodo: '1m',
  pipeline: null,
  kpis: null,
  alerta: null,
  cargandoPipeline: true,
  cargandoKpis: true,
  errorPipeline: null,
  errorKpis: null
};

@Injectable({ providedIn: 'root' })
export class DashboardCedenteService {
  private readonly estado = new BehaviorSubject<DashboardCedenteState>(ESTADO_INICIAL);
  readonly estado$ = this.estado.asObservable();

  constructor(private readonly http: HttpClient) {}

  get estadoActual(): DashboardCedenteState {
    return this.estado.value;
  }

  cargarPipeline(): void {
    this.estado.next({ ...this.estado.value, cargandoPipeline: true, errorPipeline: null });

    this.http.get<PipelineCedente>('/api/bff/dashboard/cedente/pipeline').pipe(
      tap(pipeline => {
        this.estado.next({ ...this.estado.value, pipeline, cargandoPipeline: false });
      }),
      catchError(err => {
        this.estado.next({ ...this.estado.value, cargandoPipeline: false, errorPipeline: err.message || 'Error al cargar pipeline' });
        return throwError(() => err);
      })
    ).subscribe();
  }

  cargarKpis(periodo: PeriodoCedente): void {
    this.estado.next({ ...this.estado.value, cargandoKpis: true, errorKpis: null, periodo });

    this.http.get<{ kpis: KpisCedente; alerta: AlertaRiesgo | null }>(
      `/api/bff/dashboard/cedente?periodo=${periodo}`
    ).pipe(
      tap(resp => {
        this.estado.next({
          ...this.estado.value,
          kpis: resp.kpis,
          alerta: resp.alerta,
          cargandoKpis: false
        });
      }),
      catchError(err => {
        this.estado.next({ ...this.estado.value, cargandoKpis: false, errorKpis: err.message || 'Error al cargar KPIs' });
        return throwError(() => err);
      })
    ).subscribe();
  }

  cambiarPeriodo(periodo: PeriodoCedente): void {
    this.cargarKpis(periodo);
  }

  reintentarPipeline(): void {
    this.cargarPipeline();
  }

  reintentarKpis(): void {
    this.cargarKpis(this.estado.value.periodo);
  }
}
