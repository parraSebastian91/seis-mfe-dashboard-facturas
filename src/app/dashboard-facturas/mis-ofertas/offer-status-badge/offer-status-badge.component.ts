import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { EstadoOferta } from '../mis-ofertas.service';

interface BadgeConfig { label: string; css: string; }

const CONFIG: Record<EstadoOferta, BadgeConfig> = {
  ACTIVA:    { label: 'Activa',    css: 'badge--activa' },
  ACEPTADA:  { label: 'Aceptada',  css: 'badge--aceptada' },
  RECHAZADA: { label: 'Rechazada', css: 'badge--rechazada' },
  VENCIDA:   { label: 'Vencida',   css: 'badge--vencida' },
  RETIRADA:  { label: 'Retirada',  css: 'badge--retirada' }
};

@Component({
  selector: 'app-offer-status-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [ngClass]="css">{{ label }}</span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }
    .badge--activa    { background: #1e3a5f; color: #60a5fa; }
    .badge--aceptada  { background: #14532d; color: #4ade80; }
    .badge--rechazada { background: #450a0a; color: #f87171; }
    .badge--vencida   { background: #27272a; color: #a1a1aa; }
    .badge--retirada  { background: #1c1c1e; color: #71717a; }
  `]
})
export class OfferStatusBadgeComponent {
  @Input({ required: true }) estado!: EstadoOferta;

  get label(): string { return CONFIG[this.estado]?.label ?? this.estado; }
  get css(): string   { return CONFIG[this.estado]?.css ?? ''; }
}
