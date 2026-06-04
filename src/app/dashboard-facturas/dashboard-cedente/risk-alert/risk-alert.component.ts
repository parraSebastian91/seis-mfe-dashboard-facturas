import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaEnRiesgo } from '../dashboard-cedente.service';

@Component({
  selector: 'app-risk-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CA-04: solo se muestra si hay facturas en riesgo -->
    <section class="risk-alert" *ngIf="facturas.length > 0" aria-label="Facturas en riesgo">
      <div class="risk-header">
        <span class="risk-icon" aria-hidden="true">⚠️</span>
        <h3 class="risk-title">{{ facturas.length }} {{ facturas.length === 1 ? 'factura próxima' : 'facturas próximas' }} a vencer sin ofertas</h3>
      </div>

      <div class="risk-divider"></div>

      <ul class="risk-list" role="list">
        <li *ngFor="let f of facturas" class="risk-item">
          <button type="button" class="risk-row" (click)="verFactura.emit(f.id)" [attr.aria-label]="'Ver factura ' + f.folio">
            <span class="folio">#{{ f.folio }}</span>
            <span class="separador" aria-hidden="true">—</span>
            <span class="razon-social">{{ f.razonSocial }}</span>
            <span class="separador" aria-hidden="true">—</span>
            <span class="vencimiento" [class.urgente]="f.diasVencimiento <= 2">
              vence en {{ f.diasVencimiento }} {{ f.diasVencimiento === 1 ? 'día' : 'días' }}
            </span>
            <span class="separador" aria-hidden="true">—</span>
            <span class="monto">${{ f.monto | number:'1.0-0' }}</span>
          </button>
        </li>
      </ul>

      <div class="risk-divider"></div>

      <button type="button" class="btn-ver-publicadas" (click)="verPublicadas.emit()">
        Ver mis facturas publicadas →
      </button>
    </section>
  `,
  styles: [`
    .risk-alert {
      background: #1c1a0e;
      border: 1px solid #92400e;
      border-left: 4px solid #f59e0b;
      border-radius: 0.875rem;
      padding: 1.25rem;
    }
    .risk-header {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .risk-icon { font-size: 1.25rem; flex-shrink: 0; }
    .risk-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #fbbf24;
    }
    .risk-divider {
      border-top: 1px solid #2c2408;
      margin: 0.875rem 0;
    }
    .risk-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .risk-row {
      background: none;
      border: none;
      padding: 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #e2e8f0;
      cursor: pointer;
      width: 100%;
      text-align: left;
      flex-wrap: wrap;
      border-radius: 0.375rem;
      transition: background 0.15s;
    }
    .risk-row:hover { background: rgba(245,158,11,0.08); }
    .folio { color: #fbbf24; font-weight: 600; }
    .separador { color: #475569; }
    .razon-social { color: #cbd5e1; }
    .vencimiento { color: #94a3b8; }
    .vencimiento.urgente { color: #f87171; font-weight: 600; }
    .monto { font-family: ui-monospace, monospace; color: #e2e8f0; }
    .btn-ver-publicadas {
      background: none;
      border: 1px solid #92400e;
      color: #fbbf24;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-ver-publicadas:hover { background: rgba(245,158,11,0.1); }
  `]
})
export class RiskAlertComponent {
  @Input() facturas: FacturaEnRiesgo[] = [];
  @Output() readonly verFactura = new EventEmitter<string>();
  @Output() readonly verPublicadas = new EventEmitter<void>();
}
