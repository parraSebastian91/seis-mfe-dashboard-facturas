import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardFacturasRoutingModule } from './dashboard-facturas-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardCedenteComponent } from './dashboard-cedente/dashboard-cedente.component';
import { MisOfertasComponent } from './mis-ofertas/mis-ofertas.component';
import { DashboardEjecutivoComponent } from './dashboard-ejecutivo/dashboard-ejecutivo.component';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    DashboardFacturasRoutingModule,
    DashboardCedenteComponent,
    MisOfertasComponent,
    DashboardEjecutivoComponent
  ]
})
export class DashboardFacturasModule { }
