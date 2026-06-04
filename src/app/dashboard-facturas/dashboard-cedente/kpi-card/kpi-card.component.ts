import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Skeleton -->
    <div class="kpi-card skeleton" *ngIf="cargando" aria-busy="true"></div>

    <!-- Contenido -->
    <div class="kpi-card" *ngIf="!cargando">
      <div class="kpi-label">{{ label }}</div>

      <div class="kpi-valor">
        <ng-container *ngIf="tipo === 'clp'">
          {{ valor | number:'1.0-0' }} <span class="kpi-unidad">CLP</span>
        </ng-container>
        <ng-container *ngIf="tipo === 'pct'">
          {{ valor | number:'1.2-2' }}<span class="kpi-unidad">% mensual</span>
        </ng-container>
        <ng-container *ngIf="tipo === 'dias'">
          {{ valor | number:'1.0-0' }} <span class="kpi-unidad">días</span>
        </ng-container>
      </div>

      <!-- Variación (EB-02: solo si variacion !== null, EB-04: no en periodo 'all') -->
      <div class="kpi-variacion"
        *ngIf="variacion !== null"
        [class.positiva]="variacion! > 0"
        [class.negativa]="variacion! < 0"
        [class.neutral]="variacion === 0">
        <span *ngIf="variacion! > 0">+{{ variacion | number:'1.0-0' }}%</span>
        <span *ngIf="variacion! < 0">{{ variacion | number:'1.0-0' }}%</span>
        <span *ngIf="variacion === 0">sin cambios</span>
        <span class="vs-label" *ngIf="variacion !== 0"> vs período anterior</span>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: #1e2330;
      border-radius: 0.875rem;
      padding: 1.25rem;
      border: 1px solid #2c3347;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .skeleton {
      height: 110px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .kpi-label {
      font-size: 0.8125rem;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .kpi-valor {
      font-size: 1.625rem;
      font-weight: 700;
      color: #f1f5f9;
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
    }
    .kpi-unidad {
      font-size: 0.875rem;
      font-weight: 400;
      color: #64748b;
      margin-left: 0.25rem;
    }
    .kpi-variacion {
      font-size: 0.8125rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }
    .kpi-variacion.positiva { color: #34d399; }
    .kpi-variacion.negativa { color: #f87171; }
    .kpi-variacion.neutral { color: #94a3b8; }
    .vs-label {
      font-size: 0.75rem;
      font-weight: 400;
      color: #64748b;
    }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() valor = 0;
  /** 'clp' | 'pct' | 'dias' */
  @Input() tipo: 'clp' | 'pct' | 'dias' = 'clp';
  /** null = no mostrar variación (EB-02, EB-04) */
  @Input() variacion: number | null = null;
  @Input() cargando = true;
}
