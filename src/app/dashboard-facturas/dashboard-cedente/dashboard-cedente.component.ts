import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardCedenteService, DashboardCedenteState, PeriodoCedente } from './dashboard-cedente.service';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';
import { PipelineSummaryComponent } from './pipeline-summary/pipeline-summary.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { RiskAlertComponent } from './risk-alert/risk-alert.component';

@Component({
  selector: 'app-dashboard-cedente',
  standalone: true,
  imports: [
    CommonModule,
    PeriodSelectorComponent,
    PipelineSummaryComponent,
    KpiCardComponent,
    RiskAlertComponent
  ],
  templateUrl: './dashboard-cedente.component.html',
  styleUrls: ['./dashboard-cedente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCedenteComponent implements OnInit, OnDestroy {
  estado: DashboardCedenteState | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dashboardSvc: DashboardCedenteService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardSvc.estado$.pipe(takeUntil(this.destroy$)).subscribe(estado => {
      this.estado = estado;
      this.cdr.markForCheck();
    });

    this.dashboardSvc.cargarPipeline();
    this.dashboardSvc.cargarKpis(this.dashboardSvc.estadoActual.periodo);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get periodo(): PeriodoCedente {
    return this.estado?.periodo ?? '1m';
  }

  get todosFueronCero(): boolean {
    const k = this.estado?.kpis;
    if (!k) return false;
    return k.capitalRecibido.valor === 0
      && k.capitalPorRecibir === 0
      && k.costoPromedioFinanciamiento.valor === 0
      && k.tiempoPromedioFinanciamiento.valor === 0;
  }

  /** Retorna null cuando el período es "all" para suprimir variaciones (EB-04) */
  variacion(val: number | null): number | null {
    return this.periodo === 'all' ? null : val;
  }

  onPeriodoCambio(periodo: PeriodoCedente): void {
    this.dashboardSvc.cambiarPeriodo(periodo);
  }

  onReintentarPipeline(): void {
    this.dashboardSvc.reintentarPipeline();
  }

  onReintentarKpis(): void {
    this.dashboardSvc.reintentarKpis();
  }

  onNavegarEstado(ruta: string): void {
    globalThis.location.href = ruta;
  }

  onVerFactura(id: string): void {
    globalThis.location.href = `/publicador/factura/${id}`;
  }

  onVerPublicadas(): void {
    globalThis.location.href = '/publicador';
  }
}
