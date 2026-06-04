import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteraActiva } from '../dashboard-ejecutivo.service';

@Component({
  selector: 'app-cartera-activa-summary',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cartera" aria-label="Cartera activa">
      <h2 class="cartera__title">Cartera Activa</h2>

      <!-- Barra de progreso (CA-02: solo si cupoTotal está configurado) -->
      <ng-container *ngIf="cartera && cartera.cupoTotal !== null">
        <div class="cartera__barra-wrap">
          <div class="cartera__barra-labels">
            <span class="cartera__barra-label">
              Desplegado {{ formatearCLP(cartera.capitalDesplegado) }}
            </span>
            <span class="cartera__barra-label cartera__barra-label--pct">
              {{ porcentaje | number:'1.0-0' }}%
            </span>
          </div>
          <div class="cartera__barra" role="progressbar"
            [attr.aria-valuenow]="porcentaje"
            aria-valuemin="0"
            aria-valuemax="100">
            <div class="cartera__barra-fill" [style.width.%]="porcentaje"></div>
          </div>
          <div class="cartera__barra-labels">
            <span class="cartera__barra-label--sub">Capital disponible</span>
            <span class="cartera__barra-label">{{ formatearCLP(capitalDisponible) }}</span>
          </div>
        </div>
      </ng-container>

      <!-- Sin límite configurado (EB-01) -->
      <div *ngIf="cartera && cartera.cupoTotal === null" class="cartera__sin-limite">
        <span class="cartera__valor">{{ formatearCLP(cartera.capitalDesplegado) }}</span>
        <span class="cartera__nota">(sin límite configurado)</span>
      </div>

      <!-- Sin operaciones (CA-02) -->
      <div *ngIf="cartera && cartera.capitalDesplegado === 0 && cartera.cupoTotal !== null"
        class="cartera__sin-ops">
        Sin operaciones activas.
      </div>

      <!-- KPIs de cartera -->
      <div *ngIf="cartera" class="cartera__kpis">
        <div class="cartera__kpi">
          <span class="cartera__kpi-valor">{{ cartera.ofertasActivas }}</span>
          <span class="cartera__kpi-label">Ofertas activas</span>
        </div>
        <div class="cartera__kpi">
          <span class="cartera__kpi-valor">{{ formatearCLP(cartera.capitalDesplegado) }}</span>
          <span class="cartera__kpi-label">Capital desplegado</span>
        </div>
        <div class="cartera__kpi">
          <span class="cartera__kpi-valor">{{ formatearCLP(cartera.retornoProyectado) }}</span>
          <span class="cartera__kpi-label">Retorno proyectado</span>
        </div>
        <div class="cartera__kpi">
          <span class="cartera__kpi-valor">{{ cartera.tasaPromedioCartera | number:'1.2-2' }}% mensual</span>
          <span class="cartera__kpi-label">Tasa promedio</span>
        </div>
      </div>

      <!-- Skeleton -->
      <div *ngIf="cargando" class="cartera__skeleton" aria-busy="true">
        <div class="skel skel--barra"></div>
        <div class="cartera__kpis">
          <div *ngFor="let i of skeletons" class="skel skel--kpi"></div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error && !cargando" class="cartera__error" role="alert">
        <span>{{ error }}</span>
        <button type="button" class="btn-reintentar" (click)="reintentar.emit()">Reintentar</button>
      </div>
    </section>
  `,
  styles: [`
    .cartera {
      background: #131620;
      border: 1px solid #1e2028;
      border-radius: 12px;
      padding: 20px 24px;
    }
    .cartera__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 16px;
    }
    /* Barra */
    .cartera__barra-wrap { margin-bottom: 16px; }
    .cartera__barra-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .cartera__barra-label {
      font-size: 0.8rem;
      color: #a1a1aa;
      font-weight: 500;
    }
    .cartera__barra-label--pct { color: #60a5fa; font-weight: 700; }
    .cartera__barra-label--sub { font-size: 0.75rem; color: #52525b; }
    .cartera__barra {
      height: 8px;
      background: #27272a;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .cartera__barra-fill {
      height: 100%;
      background: linear-gradient(90deg, #1d4ed8, #60a5fa);
      border-radius: 999px;
      transition: width 0.6s ease;
      min-width: 2px;
    }
    /* Sin límite / sin ops */
    .cartera__sin-limite {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 16px;
    }
    .cartera__valor { font-size: 1.4rem; font-weight: 700; color: #f4f4f5; }
    .cartera__nota  { font-size: 0.75rem; color: #52525b; }
    .cartera__sin-ops { font-size: 0.8rem; color: #52525b; margin-bottom: 16px; }
    /* KPIs */
    .cartera__kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .cartera__kpi { display: flex; flex-direction: column; gap: 4px; }
    .cartera__kpi-valor {
      font-size: 1rem;
      font-weight: 700;
      color: #f4f4f5;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
    .cartera__kpi-label { font-size: 0.72rem; color: #71717a; }
    /* Skeleton */
    .cartera__skeleton {}
    .skel {
      border-radius: 6px;
      background: linear-gradient(90deg, #1e2028 25%, #252830 50%, #1e2028 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    .skel--barra { height: 8px; width: 100%; margin-bottom: 16px; }
    .skel--kpi   { height: 40px; }
    @keyframes shimmer { to { background-position: -200% 0; } }
    /* Error */
    .cartera__error {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #f87171;
      font-size: 0.85rem;
    }
    .btn-reintentar {
      padding: 4px 12px;
      border-radius: 6px;
      background: transparent;
      border: 1px solid #3f3f46;
      color: #a1a1aa;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-reintentar:hover { background: #27272a; }
    @media (max-width: 767px) {
      .cartera__kpis { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class CarteraActivaSummaryComponent {
  @Input() cartera: CarteraActiva | null = null;
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Output() readonly reintentar = new EventEmitter<void>();

  readonly skeletons = [0, 1, 2, 3];

  get capitalDisponible(): number {
    const cupo = this.cartera?.cupoTotal;
    if (cupo === null || cupo === undefined) return 0;
    return Math.max(0, cupo - (this.cartera?.capitalDesplegado ?? 0));
  }

  get porcentaje(): number {
    const cupo = this.cartera?.cupoTotal;
    if (!cupo) return 0;
    return Math.min(100, ((this.cartera?.capitalDesplegado ?? 0) / cupo) * 100);
  }

  formatearCLP(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor);
  }
}
