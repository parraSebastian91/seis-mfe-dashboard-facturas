import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { OfertaActivaPipeline } from '../dashboard-ejecutivo.service';

const MAX_VISIBLE = 5;

@Component({
  selector: 'app-activa-offers-pipeline',
  standalone: true,
  imports: [NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *ngIf="ofertas.length > 0" class="pipeline" aria-label="Pipeline en espera">
      <div class="pipeline__header">
        <h2 class="pipeline__title">Pipeline en espera</h2>
        <span class="pipeline__badge">{{ ofertas.length }} oferta{{ ofertas.length !== 1 ? 's' : '' }} sin respuesta</span>
      </div>

      <ul class="pipeline__list" role="list">
        <li *ngFor="let oferta of visibles" class="pipeline__item"
          role="listitem"
          tabindex="0"
          (click)="onClickOferta(oferta)"
          (keydown.enter)="onClickOferta(oferta)"
          (keydown.space)="onClickOferta(oferta)">
          <div class="pipeline__info">
            <span class="pipeline__folio">#{{ oferta.folioFactura }}</span>
            <span class="pipeline__deudor">{{ oferta.razonSocialDeudor }}</span>
          </div>
          <div class="pipeline__metas">
            <span class="pipeline__monto">{{ formatearCLP(oferta.montoAnticipado) }}</span>
            <span class="pipeline__tasa">{{ oferta.tasa.toFixed(2) }}%</span>
            <span class="pipeline__tiempo">hace {{ diasDesde(oferta.fechaOferta) }} día{{ diasDesde(oferta.fechaOferta) !== 1 ? 's' : '' }}</span>
          </div>
        </li>
      </ul>

      <div *ngIf="ofertas.length > maxVisible" class="pipeline__footer">
        <button type="button" class="pipeline__ver-todas" (click)="verTodas.emit()">
          Ver todas mis ofertas →
        </button>
      </div>
    </section>
  `,
  styles: [`
    .pipeline {
      background: #131620;
      border: 1px solid #1e2028;
      border-radius: 12px;
      overflow: hidden;
    }
    .pipeline__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid #1e2028;
    }
    .pipeline__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f4f4f5;
      margin: 0;
    }
    .pipeline__badge {
      font-size: 0.72rem;
      font-weight: 600;
      background: #1e3a5f;
      color: #60a5fa;
      padding: 2px 10px;
      border-radius: 999px;
    }
    .pipeline__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .pipeline__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid #1a1d24;
      cursor: pointer;
      transition: background 0.12s;
    }
    .pipeline__item:last-child { border-bottom: none; }
    .pipeline__item:hover { background: #0f1117; }
    .pipeline__item:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: -2px;
    }
    .pipeline__info {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }
    .pipeline__folio {
      font-weight: 600;
      color: #f4f4f5;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    .pipeline__deudor {
      color: #71717a;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pipeline__metas {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }
    .pipeline__monto {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #d4d4d8;
    }
    .pipeline__tasa {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #a1a1aa;
    }
    .pipeline__tiempo {
      font-size: 0.75rem;
      color: #52525b;
      white-space: nowrap;
    }
    .pipeline__footer {
      padding: 12px 20px;
      border-top: 1px solid #1e2028;
      text-align: right;
    }
    .pipeline__ver-todas {
      background: transparent;
      border: none;
      color: #60a5fa;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }
    .pipeline__ver-todas:hover { color: #93c5fd; text-decoration: underline; }
    @media (max-width: 640px) {
      .pipeline__item { flex-direction: column; align-items: flex-start; gap: 8px; }
      .pipeline__metas { gap: 10px; }
    }
  `]
})
export class ActivaOffersPipelineComponent {
  @Input() ofertas: OfertaActivaPipeline[] = [];
  @Output() readonly clickOferta  = new EventEmitter<OfertaActivaPipeline>();
  @Output() readonly verTodas     = new EventEmitter<void>();

  readonly maxVisible = MAX_VISIBLE;

  get visibles(): OfertaActivaPipeline[] {
    return this.ofertas.slice(0, MAX_VISIBLE);
  }

  diasDesde(isoDate: string): number {
    const ms = Date.now() - new Date(isoDate).getTime();
    return Math.max(0, Math.floor(ms / 86_400_000));
  }

  formatearCLP(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  onClickOferta(oferta: OfertaActivaPipeline): void {
    this.clickOferta.emit(oferta);
  }
}
