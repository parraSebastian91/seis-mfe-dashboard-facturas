import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodoCedente } from '../dashboard-cedente.service';

export interface OpcionPeriodo {
  valor: PeriodoCedente;
  etiqueta: string;
}

@Component({
  selector: 'app-period-selector',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="period-selector" role="group" aria-label="Selector de período">
      <button
        *ngFor="let op of opciones"
        type="button"
        class="period-pill"
        [class.activo]="periodoActivo === op.valor"
        (click)="seleccionar(op.valor)"
        [attr.aria-pressed]="periodoActivo === op.valor">
        {{ op.etiqueta }}
      </button>
    </div>
  `,
  styles: [`
    .period-selector {
      display: flex;
      gap: 0.375rem;
      background: #1e2330;
      padding: 0.25rem;
      border-radius: 0.625rem;
      width: fit-content;
    }
    .period-pill {
      padding: 0.375rem 0.875rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      background: transparent;
      color: #94a3b8;
      transition: background 0.15s, color 0.15s;
    }
    .period-pill.activo {
      background: #2563eb;
      color: #fff;
    }
    .period-pill:hover:not(.activo) {
      background: #2c3347;
      color: #e2e8f0;
    }
  `]
})
export class PeriodSelectorComponent {
  @Input() periodoActivo: PeriodoCedente = '1m';
  @Output() readonly periodoChange = new EventEmitter<PeriodoCedente>();

  readonly opciones: OpcionPeriodo[] = [
    { valor: '1m', etiqueta: 'Último mes' },
    { valor: '3m', etiqueta: 'Últimos 3 meses' },
    { valor: '6m', etiqueta: 'Últimos 6 meses' },
    { valor: 'ytd', etiqueta: 'Este año' },
    { valor: 'all', etiqueta: 'Todo' }
  ];

  seleccionar(periodo: PeriodoCedente): void {
    if (periodo !== this.periodoActivo) {
      this.periodoChange.emit(periodo);
    }
  }
}
