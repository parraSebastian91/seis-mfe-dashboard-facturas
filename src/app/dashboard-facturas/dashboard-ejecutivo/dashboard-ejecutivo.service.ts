import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { PeriodoCedente } from '../dashboard-cedente/dashboard-cedente.service';

export type PeriodoEjecutivo = PeriodoCedente;

export interface CarteraActiva {
  capitalDesplegado: number;
  cupoTotal: number | null;
  ofertasActivas: number;
  tasaPromedioCartera: number;
  retornoProyectado: number;
}

export interface OfertaActivaPipeline {
  ofertaId: string;
  folioFactura: string;
  razonSocialDeudor: string;
  montoAnticipado: number;
  tasa: number;
  fechaOferta: string;
  tieneChat: boolean;
}

export interface KpisEjecutivo {
  retornoRealizado: number;
  retornoRealizadoVariacion: number | null;
  operacionesCerradas: number;
  operacionesCerradasVariacion: number | null;
  ticketPromedio: number | null;
  ticketPromedioVariacion: number | null;
}

export interface DashboardEjecutivoState {
  cargandoCartera: boolean;
  errorCartera: string | null;
  cartera: CarteraActiva | null;
  ofertasPipeline: OfertaActivaPipeline[];

  cargandoKpis: boolean;
  errorKpis: string | null;
  kpis: KpisEjecutivo | null;

  periodoActivo: PeriodoEjecutivo;
}

const ESTADO_INICIAL: DashboardEjecutivoState = {
  cargandoCartera: true,
  errorCartera: null,
  cartera: null,
  ofertasPipeline: [],

  cargandoKpis: true,
  errorKpis: null,
  kpis: null,

  periodoActivo: '1m'
};

@Injectable({ providedIn: 'root' })
export class DashboardEjecutivoService {
  private readonly http = inject(HttpClient);
  private readonly _estado = new BehaviorSubject<DashboardEjecutivoState>(ESTADO_INICIAL);
  readonly estado$ = this._estado.asObservable();

  cargarCartera(): void {
    this._estado.next({ ...this._estado.value, cargandoCartera: true, errorCartera: null });
    this.http.get<{ cartera: CarteraActiva; pipeline: OfertaActivaPipeline[] }>(
      '/api/core/dashboard/ejecutivo/cartera'
    ).pipe(catchError(() => of(null))).subscribe(res => {
      if (!res) {
        this._estado.next({
          ...this._estado.value,
          cargandoCartera: false,
          errorCartera: 'No se pudo cargar la cartera activa.'
        });
        return;
      }
      this._estado.next({
        ...this._estado.value,
        cargandoCartera: false,
        cartera: res.cartera,
        ofertasPipeline: res.pipeline
      });
    });
  }

  cargarKpis(periodo: PeriodoEjecutivo = '1m'): void {
    this._estado.next({ ...this._estado.value, cargandoKpis: true, errorKpis: null });
    const params = new HttpParams().set('periodo', periodo);
    this.http.get<KpisEjecutivo>('/api/core/dashboard/ejecutivo', { params }).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (!res) {
        this._estado.next({
          ...this._estado.value,
          cargandoKpis: false,
          errorKpis: 'No se pudieron cargar los KPIs del período.'
        });
        return;
      }
      this._estado.next({ ...this._estado.value, cargandoKpis: false, kpis: res });
    });
  }

  cambiarPeriodo(periodo: PeriodoEjecutivo): void {
    this._estado.next({ ...this._estado.value, periodoActivo: periodo });
    this.cargarKpis(periodo);
  }

  reintentarCartera(): void {
    this.cargarCartera();
  }

  reintentarKpis(): void {
    this.cargarKpis(this._estado.value.periodoActivo);
  }
}
