import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-offer-retire-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog open class="dialog" aria-labelledby="retire-dialog-title">
      <div class="dialog__backdrop" (click)="!cargando && cancelar.emit()"></div>
      <div class="dialog__panel" role="document">
        <h2 id="retire-dialog-title" class="dialog__title">¿Retirar oferta?</h2>
        <p class="dialog__body">Esta acción no se puede deshacer.</p>
        <div class="dialog__actions">
          <button
            type="button"
            class="btn btn--ghost"
            [disabled]="cargando"
            (click)="cancelar.emit()">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn--danger"
            [disabled]="cargando"
            (click)="confirmar.emit()">
            {{ cargando ? 'Retirando…' : 'Sí, retirar' }}
          </button>
        </div>
      </div>
    </dialog>
  `,
  styles: [`
    dialog {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      padding: 0;
      max-width: 100%;
      max-height: 100%;
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
    }
    .dialog__panel {
      position: relative;
      background: #1a1d24;
      border: 1px solid #2a2d36;
      border-radius: 12px;
      padding: 28px 32px;
      min-width: 320px;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .dialog__title {
      margin: 0 0 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #f4f4f5;
    }
    .dialog__body {
      margin: 0 0 24px;
      color: #a1a1aa;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .dialog__actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 0.15s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--danger  { background: #dc2626; color: #fff; }
    .btn--danger:hover:not(:disabled)  { background: #b91c1c; }
    .btn--ghost   { background: transparent; border: 1px solid #3f3f46; color: #a1a1aa; }
    .btn--ghost:hover:not(:disabled)   { background: #27272a; }
  `]
})
export class OfferRetireConfirmDialogComponent {
  @Input() cargando = false;
  @Output() readonly confirmar = new EventEmitter<void>();
  @Output() readonly cancelar  = new EventEmitter<void>();
}
