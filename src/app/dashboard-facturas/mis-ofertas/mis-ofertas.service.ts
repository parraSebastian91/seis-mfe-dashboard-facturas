import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';

export type EstadoOferta = 'ACTIVA' | 'ACEPTADA' | 'RECHAZADA' | 'VENCIDA' | 'RETIRADA';
export type FiltroEstadoOfertas = EstadoOferta | 'TODAS';

export interface MiOferta {
  ofertaId: string;
  folioFactura: string;
  razonSocialDeudor: string;
  /** EB-02: false si la factura fue eliminada del sistema */
  facturaDisponible: boolean;
  estadoFactura: string;
  /** EB-04: true si el cedente retiró la factura */
  facturaRetirada: boolean;
  montoAnticipado: number;
  tasa: number;
  fechaOferta: string;
  estadoOferta: EstadoOferta;
  tieneChat: boolean;
}

export interface MisOfertasState {
  ofertas: MiOferta[];
  cargando: boolean;
  error: string | null;
  filtroEstado: FiltroEstadoOfertas;
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  retirando: string | null;
}

interface OfertasPage {
  content: MiOferta[];
  totalPages: number;
  totalElements: number;
  pageable: { pageNumber: number };
}

const ESTADO_INICIAL: MisOfertasState = {
  ofertas: [],
  cargando: false,
  error: null,
  filtroEstado: 'TODAS',
  paginaActual: 0,
  totalPaginas: 0,
  totalElementos: 0,
  retirando: null
};

@Injectable({ providedIn: 'root' })
export class MisOfertasService {
  private readonly http = inject(HttpClient);
  private readonly _estado = new BehaviorSubject<MisOfertasState>(ESTADO_INICIAL);
  readonly estado$ = this._estado.asObservable();

  cargar(filtro: FiltroEstadoOfertas = 'TODAS', pagina = 0): void {
    this._estado.next({ ...this._estado.value, cargando: true, error: null });
    let params = new HttpParams()
      .set('page', pagina.toString())
      .set('size', '20');
    if (filtro !== 'TODAS') {
      params = params.set('estado', filtro);
    }
    this.http.get<OfertasPage>('/api/bff/ejecutivo/ofertas', { params }).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (!res) {
        this._estado.next({
          ...this._estado.value,
          cargando: false,
          error: 'No se pudieron cargar las ofertas.'
        });
        return;
      }
      this._estado.next({
        ...this._estado.value,
        cargando: false,
        ofertas: res.content,
        paginaActual: res.pageable.pageNumber,
        totalPaginas: res.totalPages,
        totalElementos: res.totalElements
      });
    });
  }

  cambiarFiltro(filtro: FiltroEstadoOfertas): void {
    this._estado.next({ ...this._estado.value, filtroEstado: filtro });
    this.cargar(filtro, 0);
  }

  cambiarPagina(pagina: number): void {
    const { filtroEstado } = this._estado.value;
    this._estado.next({ ...this._estado.value, paginaActual: pagina });
    this.cargar(filtroEstado, pagina);
  }

  retirar(ofertaId: string): void {
    this._estado.next({ ...this._estado.value, retirando: ofertaId });
    this.http.patch<void>(`/api/bff/oferta/${ofertaId}/retirar`, {}).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      const ofertas = this._estado.value.ofertas.map(o =>
        o.ofertaId === ofertaId
          ? { ...o, estadoOferta: 'RETIRADA' as EstadoOferta, tieneChat: false }
          : o
      );
      this._estado.next({ ...this._estado.value, retirando: null, ofertas });
    });
  }

  reintentar(): void {
    const { filtroEstado, paginaActual } = this._estado.value;
    this.cargar(filtroEstado, paginaActual);
  }
}
