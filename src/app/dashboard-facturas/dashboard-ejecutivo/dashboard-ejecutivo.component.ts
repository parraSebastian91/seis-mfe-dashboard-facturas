import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  DashboardEjecutivoService,
  DashboardEjecutivoState,
  OfertaActivaPipeline,
  PeriodoEjecutivo
} from './dashboard-ejecutivo.service';
import { PeriodSelectorComponent } from '../dashboard-cedente/period-selector/period-selector.component';
import { KpiCardComponent } from '../dashboard-cedente/kpi-card/kpi-card.component';
import { CarteraActivaSummaryComponent } from './cartera-activa-summary/cartera-activa-summary.component';
import { ActivaOffersPipelineComponent } from './activa-offers-pipeline/activa-offers-pipeline.component';

@Component({
  selector: 'app-dashboard-ejecutivo',
  standalone: true,
  imports: [NgIf, PeriodSelectorComponent, KpiCardComponent, CarteraActivaSummaryComponent, ActivaOffersPipelineComponent],
  templateUrl: './dashboard-ejecutivo.component.html',
  styleUrl: './dashboard-ejecutivo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardEjecutivoComponent implements OnInit, OnDestroy {
  private readonly svc      = inject(DashboardEjecutivoService);
  private readonly cdr      = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  estado: DashboardEjecutivoState | null = null;

  get periodo(): PeriodoEjecutivo {
    return this.estado?.periodoActivo ?? '1m';
  }

  get esVacioGeneral(): boolean {
    return !this.estado?.cargandoCartera &&
      !this.estado?.errorCartera &&
      !this.estado?.cartera &&
      !this.estado?.cargandoKpis &&
      !this.estado?.errorKpis;
  }

  /** EB-04: ticket promedio es null cuando no hay operaciones cerradas */
  get ticketPromedioValor(): string {
    if (!this.estado?.kpis) return '—';
    if (this.estado.kpis.ticketPromedio === null) return '—';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(this.estado.kpis.ticketPromedio);
  }

  /** Suprime variaciones cuando el período es 'all' (CA-01 / HU-31 EB-04) */
  variacion(val: number | null | undefined): number | null {
    if (this.periodo === 'all') return null;
    return val ?? null;
  }

  ngOnInit(): void {
    this.svc.estado$.pipe(takeUntil(this.destroy$)).subscribe(estado => {
      this.estado = estado;
      this.cdr.markForCheck();
    });
    this.svc.cargarCartera();
    this.svc.cargarKpis('1m');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPeriodoCambio(periodo: PeriodoEjecutivo): void {
    this.svc.cambiarPeriodo(periodo);
  }

  onReintentarCartera(): void {
    this.svc.reintentarCartera();
  }

  onReintentarKpis(): void {
    this.svc.reintentarKpis();
  }

  onClickOferta(oferta: OfertaActivaPipeline): void {
    if (oferta.tieneChat) {
      globalThis.location.href = `/dashboard/mis-ofertas?ofertaId=${oferta.ofertaId}`;
    } else {
      globalThis.location.href = `/ofertador?facturaId=${oferta.folioFactura}`;
    }
  }

  onVerTodasOfertas(): void {
    globalThis.location.href = '/dashboard/mis-ofertas?estado=ACTIVA';
  }

  navegarOfertador(): void {
    globalThis.location.href = '/ofertador';
  }
}
