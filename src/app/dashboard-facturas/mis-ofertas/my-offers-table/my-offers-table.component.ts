import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiOferta } from '../mis-ofertas.service';
import { OfferStatusBadgeComponent } from '../offer-status-badge/offer-status-badge.component';

@Component({
  selector: 'app-my-offers-table',
  standalone: true,
  imports: [CommonModule, OfferStatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Skeleton -->
    <ng-container *ngIf="cargando">
      <div class="skeleton-wrapper" aria-busy="true" aria-label="Cargando ofertas">
        <div class="skeleton-row" *ngFor="let i of skeletonRows">
          <div class="skel skel--lg"></div>
          <div class="skel skel--md"></div>
          <div class="skel skel--sm"></div>
          <div class="skel skel--md hide-md"></div>
          <div class="skel skel--sm"></div>
          <div class="skel skel--md"></div>
          <div class="skel skel--sm"></div>
        </div>
      </div>
    </ng-container>

    <!-- Error -->
    <div *ngIf="error && !cargando" class="estado-error" role="alert">
      <span class="estado-error__msg">{{ error }}</span>
      <button type="button" class="btn btn--ghost" (click)="reintentar.emit()">Reintentar</button>
    </div>

    <!-- Empty state: sin ofertas en el filtro activo -->
    <div *ngIf="!cargando && !error && ofertas.length === 0" class="estado-vacio">
      <p class="estado-vacio__msg">No tienes ofertas en este estado.</p>
    </div>

    <!-- Tabla (md+) -->
    <div *ngIf="!cargando && !error && ofertas.length > 0" class="table-scroll">
      <table class="offers-table">
        <thead>
          <tr>
            <th scope="col">Factura</th>
            <th scope="col">Monto ofertado</th>
            <th scope="col">Tasa</th>
            <th scope="col" class="hide-md">Fecha de oferta</th>
            <th scope="col">Estado oferta</th>
            <th scope="col">Estado factura</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let oferta of ofertas">
            <!-- Factura -->
            <td>
              <ng-container *ngIf="oferta.facturaDisponible; else noDisponible">
                <span class="folio">#{{ oferta.folioFactura }}</span>
                <span class="deudor">{{ oferta.razonSocialDeudor }}</span>
              </ng-container>
              <ng-template #noDisponible>
                <span class="folio">#{{ oferta.folioFactura }}</span>
                <span class="tag-alerta">(factura no disponible)</span>
              </ng-template>
            </td>
            <!-- Monto -->
            <td class="mono">{{ formatearMonto(oferta.montoAnticipado) }}</td>
            <!-- Tasa -->
            <td class="mono">{{ formatearTasa(oferta.tasa) }}</td>
            <!-- Fecha -->
            <td class="hide-md">{{ formatearFecha(oferta.fechaOferta) }}</td>
            <!-- Estado oferta -->
            <td>
              <app-offer-status-badge [estado]="oferta.estadoOferta"></app-offer-status-badge>
            </td>
            <!-- Estado factura -->
            <td>
              <span *ngIf="oferta.facturaRetirada" class="tag-alerta">Factura retirada por el cliente</span>
              <span *ngIf="!oferta.facturaRetirada" class="factura-estado">{{ oferta.estadoFactura }}</span>
            </td>
            <!-- Acciones -->
            <td class="acciones">
              <ng-container [ngSwitch]="oferta.estadoOferta">
                <ng-container *ngSwitchCase="'ACTIVA'">
                  <button *ngIf="oferta.tieneChat" type="button" class="btn-accion btn-accion--chat"
                    (click)="abrirChat.emit(oferta.ofertaId)" aria-label="Ver chat">
                    Ver chat
                  </button>
                  <button type="button" class="btn-accion btn-accion--retirar"
                    (click)="retirarOferta.emit(oferta.ofertaId)" aria-label="Retirar oferta">
                    Retirar
                  </button>
                </ng-container>
                <ng-container *ngSwitchCase="'ACEPTADA'">
                  <button type="button" class="btn-accion btn-accion--chat"
                    (click)="abrirChat.emit(oferta.ofertaId)" aria-label="Ver chat">
                    Ver chat
                  </button>
                </ng-container>
                <ng-container *ngSwitchCase="'RECHAZADA'">
                  <button *ngIf="oferta.tieneChat" type="button" class="btn-accion btn-accion--chat"
                    (click)="abrirChat.emit(oferta.ofertaId)" aria-label="Ver chat">
                    Ver chat
                  </button>
                </ng-container>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginador (tabla) -->
      <nav *ngIf="totalPaginas > 1" class="paginador" aria-label="Paginación">
        <button type="button" class="pag-btn"
          [disabled]="paginaActual === 0"
          (click)="cambiarPagina.emit(paginaActual - 1)"
          aria-label="Página anterior">
          ‹
        </button>
        <button *ngFor="let p of paginasArray" type="button" class="pag-btn"
          [class.activa]="p === paginaActual"
          [attr.aria-current]="p === paginaActual ? 'page' : null"
          (click)="cambiarPagina.emit(p)">
          {{ p + 1 }}
        </button>
        <button type="button" class="pag-btn"
          [disabled]="paginaActual === totalPaginas - 1"
          (click)="cambiarPagina.emit(paginaActual + 1)"
          aria-label="Página siguiente">
          ›
        </button>
      </nav>
    </div>

    <!-- Vista tarjetas (xs-sm) -->
    <div *ngIf="!cargando && !error && ofertas.length > 0" class="cards-list">
      <article *ngFor="let oferta of ofertas" class="offer-card">
        <div class="offer-card__header">
          <div class="offer-card__factura">
            <span class="folio">#{{ oferta.folioFactura }}</span>
            <span *ngIf="!oferta.facturaDisponible" class="tag-alerta">(no disponible)</span>
            <span *ngIf="oferta.facturaDisponible" class="deudor">{{ oferta.razonSocialDeudor }}</span>
          </div>
          <app-offer-status-badge [estado]="oferta.estadoOferta"></app-offer-status-badge>
        </div>
        <div class="offer-card__body">
          <div class="offer-card__row">
            <span class="offer-card__label">Monto</span>
            <span class="mono">{{ formatearMonto(oferta.montoAnticipado) }}</span>
          </div>
          <div class="offer-card__row">
            <span class="offer-card__label">Tasa</span>
            <span class="mono">{{ formatearTasa(oferta.tasa) }}</span>
          </div>
          <div class="offer-card__row">
            <span class="offer-card__label">Fecha</span>
            <span>{{ formatearFecha(oferta.fechaOferta) }}</span>
          </div>
          <div class="offer-card__row" *ngIf="oferta.facturaRetirada">
            <span class="tag-alerta">Factura retirada por el cliente</span>
          </div>
        </div>
        <div class="offer-card__actions">
          <ng-container [ngSwitch]="oferta.estadoOferta">
            <ng-container *ngSwitchCase="'ACTIVA'">
              <button *ngIf="oferta.tieneChat" type="button" class="btn-accion btn-accion--chat"
                (click)="abrirChat.emit(oferta.ofertaId)">Ver chat</button>
              <button type="button" class="btn-accion btn-accion--retirar"
                (click)="retirarOferta.emit(oferta.ofertaId)">Retirar</button>
            </ng-container>
            <ng-container *ngSwitchCase="'ACEPTADA'">
              <button type="button" class="btn-accion btn-accion--chat"
                (click)="abrirChat.emit(oferta.ofertaId)">Ver chat</button>
            </ng-container>
            <ng-container *ngSwitchCase="'RECHAZADA'">
              <button *ngIf="oferta.tieneChat" type="button" class="btn-accion btn-accion--chat"
                (click)="abrirChat.emit(oferta.ofertaId)">Ver chat</button>
            </ng-container>
          </ng-container>
        </div>
      </article>

      <!-- Paginador (mobile) -->
      <nav *ngIf="totalPaginas > 1" class="paginador" aria-label="Paginación">
        <button type="button" class="pag-btn"
          [disabled]="paginaActual === 0"
          (click)="cambiarPagina.emit(paginaActual - 1)"
          aria-label="Página anterior">‹</button>
        <span class="pag-info">{{ paginaActual + 1 }} / {{ totalPaginas }}</span>
        <button type="button" class="pag-btn"
          [disabled]="paginaActual === totalPaginas - 1"
          (click)="cambiarPagina.emit(paginaActual + 1)"
          aria-label="Página siguiente">›</button>
      </nav>
    </div>
  `,
  styles: [`
    /* ─── Skeleton ─── */
    .skeleton-wrapper { padding: 4px 0; }
    .skeleton-row {
      display: grid;
      grid-template-columns: 2fr 1.2fr 0.8fr 1fr 1fr 1.2fr 1fr;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid #1e2028;
      align-items: center;
    }
    .skel {
      height: 14px;
      border-radius: 6px;
      background: linear-gradient(90deg, #1e2028 25%, #252830 50%, #1e2028 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    .skel--sm  { width: 60%; }
    .skel--md  { width: 80%; }
    .skel--lg  { width: 100%; }
    @keyframes shimmer { to { background-position: -200% 0; } }

    /* ─── Error ─── */
    .estado-error {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #1a0a0a;
      border: 1px solid #450a0a;
      border-radius: 10px;
      margin: 8px 0;
    }
    .estado-error__msg { color: #f87171; flex: 1; }
    .btn--ghost {
      padding: 6px 14px;
      border-radius: 6px;
      background: transparent;
      border: 1px solid #3f3f46;
      color: #a1a1aa;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn--ghost:hover { background: #27272a; }

    /* ─── Empty ─── */
    .estado-vacio {
      padding: 48px 20px;
      text-align: center;
    }
    .estado-vacio__msg { color: #52525b; font-size: 0.9rem; }

    /* ─── Table ─── */
    .table-scroll { overflow-x: auto; }
    .offers-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      color: #d4d4d8;
    }
    .offers-table thead th {
      padding: 10px 12px;
      text-align: left;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #71717a;
      border-bottom: 1px solid #27272a;
      white-space: nowrap;
    }
    .offers-table tbody tr {
      border-bottom: 1px solid #1e2028;
      transition: background 0.12s;
    }
    .offers-table tbody tr:hover { background: #131620; }
    .offers-table tbody td {
      padding: 12px 12px;
      vertical-align: middle;
    }
    .folio { font-weight: 600; color: #f4f4f5; display: block; }
    .deudor { font-size: 0.78rem; color: #71717a; display: block; margin-top: 2px; }
    .mono { font-family: 'SF Mono', 'Fira Code', monospace; }
    .factura-estado { font-size: 0.8rem; color: #a1a1aa; }
    .tag-alerta { font-size: 0.75rem; color: #f59e0b; font-style: italic; }

    /* ─── Acciones ─── */
    .acciones { white-space: nowrap; }
    .btn-accion {
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      margin-right: 6px;
    }
    .btn-accion--chat    { background: #1e3a5f; color: #60a5fa; }
    .btn-accion--chat:hover    { background: #1d4ed8; color: #fff; }
    .btn-accion--retirar { background: #2d1b1b; color: #f87171; }
    .btn-accion--retirar:hover { background: #450a0a; }

    /* ─── Paginador ─── */
    .paginador {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 20px 0 4px;
    }
    .pag-btn {
      min-width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid #27272a;
      background: transparent;
      color: #a1a1aa;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .pag-btn:hover:not(:disabled)  { background: #27272a; color: #f4f4f5; }
    .pag-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .pag-btn.activa { background: #1d4ed8; border-color: #1d4ed8; color: #fff; font-weight: 700; }
    .pag-info { color: #71717a; font-size: 0.875rem; }

    /* ─── Cards (xs-sm) ─── */
    .cards-list { display: none; gap: 12px; flex-direction: column; }
    .offer-card {
      background: #131620;
      border: 1px solid #1e2028;
      border-radius: 10px;
      padding: 16px;
    }
    .offer-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
    }
    .offer-card__factura { display: flex; flex-direction: column; gap: 2px; }
    .offer-card__body { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
    .offer-card__row { display: flex; justify-content: space-between; font-size: 0.85rem; }
    .offer-card__label { color: #71717a; }
    .offer-card__actions { display: flex; gap: 8px; flex-wrap: wrap; }

    /* ─── Responsive ─── */
    @media (max-width: 767px) {
      .table-scroll { display: none; }
      .cards-list   { display: flex; }
      .skeleton-row { grid-template-columns: 2fr 1fr 1fr; }
      .skel.hide-md, .skel:nth-child(n+4):not(.hide-md) { display: none; }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .hide-md { display: none; }
      .skeleton-row { grid-template-columns: 2fr 1.2fr 0.8fr 1fr 1.2fr 1fr; }
      .skel.hide-md { display: none; }
    }
  `]
})
export class MyOffersTableComponent {
  @Input() ofertas: MiOferta[] = [];
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Input() paginaActual = 0;
  @Input() totalPaginas = 0;

  @Output() readonly reintentar    = new EventEmitter<void>();
  @Output() readonly cambiarPagina = new EventEmitter<number>();
  @Output() readonly retirarOferta = new EventEmitter<string>();
  @Output() readonly abrirChat     = new EventEmitter<string>();

  readonly skeletonRows = [0, 1, 2, 3, 4];

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(monto);
  }

  formatearTasa(tasa: number): string {
    return `${tasa.toFixed(2)}%`;
  }

  formatearFecha(isoDate: string): string {
    const d = new Date(isoDate);
    const dd   = d.getDate().toString().padStart(2, '0');
    const mm   = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}
