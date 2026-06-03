import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  standalone: false
})
export class DashboardHomeComponent {
  cards = [
    { title: 'Facturas Emitidas', value: '1,245', trend: '+12%' },
    { title: 'Facturas Pendientes', value: '87', trend: '-4%' },
    { title: 'Monto Facturado', value: '$238,420', trend: '+9%' }
  ];
}
