import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  FiltroEstadoOfertas,
  MisOfertasService,
  MisOfertasState
} from './mis-ofertas.service';
import { MyOffersTableComponent } from './my-offers-table/my-offers-table.component';
import { OfferRetireConfirmDialogComponent } from './offer-retire-confirm-dialog/offer-retire-confirm-dialog.component';
import { NegotiationChatComponent } from '../../../../../shared-utils/src/lib/components/negotiation-chat/negotiation-chat.component';

@Component({
  selector: 'app-mis-ofertas',
  standalone: true,
  imports: [NgIf, NgFor, MyOffersTableComponent, OfferRetireConfirmDialogComponent, NegotiationChatComponent],
  templateUrl: './mis-ofertas.component.html',
  styleUrl: './mis-ofertas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisOfertasComponent implements OnInit, OnDestroy {
  private readonly svc    = inject(MisOfertasService);
  private readonly cdr    = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  estado: MisOfertasState | null = null;
  ofertaParaRetirar: string | null = null;
  ofertaChatId: string | null = null;

  readonly filtros: Array<{ valor: FiltroEstadoOfertas; label: string }> = [
    { valor: 'ACTIVA',    label: 'Activas' },
    { valor: 'ACEPTADA',  label: 'Aceptadas' },
    { valor: 'RECHAZADA', label: 'Rechazadas' },
    { valor: 'VENCIDA',   label: 'Vencidas' },
    { valor: 'TODAS',     label: 'Todas' }
  ];

  get esVacioGeneral(): boolean {
    return !this.estado?.cargando &&
      !this.estado?.error &&
      this.estado?.filtroEstado === 'TODAS' &&
      this.estado?.totalElementos === 0;
  }

  ngOnInit(): void {
    this.svc.estado$.pipe(takeUntil(this.destroy$)).subscribe(estado => {
      this.estado = estado;
      this.cdr.markForCheck();
    });
    this.svc.cargar('TODAS', 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltro(filtro: FiltroEstadoOfertas): void {
    this.svc.cambiarFiltro(filtro);
  }

  onCambiarPagina(pagina: number): void {
    this.svc.cambiarPagina(pagina);
  }

  onReintentar(): void {
    this.svc.reintentar();
  }

  onRetirarOferta(ofertaId: string): void {
    this.ofertaParaRetirar = ofertaId;
  }

  onConfirmarRetiro(): void {
    if (this.ofertaParaRetirar) {
      this.svc.retirar(this.ofertaParaRetirar);
      this.ofertaParaRetirar = null;
    }
  }

  onCancelarRetiro(): void {
    this.ofertaParaRetirar = null;
  }

  onAbrirChat(ofertaId: string): void {
    this.ofertaChatId = ofertaId;
  }

  onCerrarChat(): void {
    this.ofertaChatId = null;
  }

  navegarOfertador(): void {
    globalThis.location.href = '/ofertador';
  }
}
