import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineCedente } from '../dashboard-cedente.service';

export interface EstadoPipeline {
  key: keyof PipelineCedente;
  etiqueta: string;
  ruta: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-pipeline-summary',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Skeleton -->
    <div class="pipeline-grid" *ngIf="cargando; else contenido">
      <div class="pipeline-card skeleton" *ngFor="let i of [1,2,3,4]"></div>
    </div>

    <!-- Error -->
    <ng-template #contenido>
      <div class="pipeline-error" *ngIf="error; else datos" role="alert">
        <span>{{ error }}</span>
        <button type="button" (click)="reintentar.emit()">Reintentar</button>
      </div>

      <ng-template #datos>
        <div class="pipeline-grid">
          <button
            *ngFor="let estado of estados"
            type="button"
            class="pipeline-card"
            [attr.aria-label]="'Ir a ' + estado.etiqueta"
            (click)="navegarEstado(estado.key)">
            <span class="estado-icono" [style.color]="estado.color" aria-hidden="true">{{ estado.icono }}</span>
            <span class="estado-count">{{ pipeline?.[estado.key] ?? 0 }}</span>
            <span class="estado-label">{{ estado.etiqueta }}</span>
          </button>
        </div>
      </ng-template>
    </ng-template>
  `,
  styles: [`
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    .pipeline-card {
      background: #1e2330;
      border-radius: 0.875rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.375rem;
      border: 1px solid #2c3347;
      cursor: pointer;
      transition: border-color 0.2s, transform 0.15s;
      text-align: left;
    }
    .pipeline-card:hover {
      border-color: #2563eb;
      transform: translateY(-2px);
    }
    .estado-icono { font-size: 1.5rem; }
    .estado-count {
      font-size: 2rem;
      font-weight: 700;
      color: #f1f5f9;
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .estado-label {
      font-size: 0.8125rem;
      color: #64748b;
      font-weight: 500;
    }
    .skeleton {
      height: 110px;
      animation: pulse 1.5s ease-in-out infinite;
      cursor: default;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .pipeline-error {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #2d1b1b;
      border-radius: 0.75rem;
      color: #fca5a5;
      font-size: 0.875rem;
    }
    .pipeline-error button {
      padding: 0.375rem 0.875rem;
      border-radius: 0.5rem;
      border: 1px solid #ef4444;
      background: transparent;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.8125rem;
      white-space: nowrap;
    }
    @media (max-width: 768px) {
      .pipeline-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class PipelineSummaryComponent {
  @Input() pipeline: PipelineCedente | null = null;
  @Input() cargando = true;
  @Input() error: string | null = null;
  @Output() readonly reintentar = new EventEmitter<void>();
  @Output() readonly navegarA = new EventEmitter<string>();

  readonly estados: EstadoPipeline[] = [
    { key: 'PUBLICADA', etiqueta: 'Publicadas', ruta: '/publicador?estado=PUBLICADA', icono: '📄', color: '#60a5fa' },
    { key: 'OFERTADA', etiqueta: 'Con oferta', ruta: '/publicador?estado=OFERTADA', icono: '🏷️', color: '#a78bfa' },
    { key: 'FINANCIADA', etiqueta: 'Financiadas', ruta: '/publicador?estado=FINANCIADA', icono: '✅', color: '#34d399' },
    { key: 'PENDIENTE_VERIFICACION_PAGO', etiqueta: 'Verificando pago', ruta: '/publicador?estado=PENDIENTE_VERIFICACION_PAGO', icono: '⏳', color: '#fbbf24' }
  ];

  navegarEstado(key: keyof PipelineCedente): void {
    const estado = this.estados.find(e => e.key === key);
    if (estado) {
      this.navegarA.emit(estado.ruta);
    }
  }
}
