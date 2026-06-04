import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardCedenteComponent } from './dashboard-cedente/dashboard-cedente.component';
import { MisOfertasComponent } from './mis-ofertas/mis-ofertas.component';
import { DashboardEjecutivoComponent } from './dashboard-ejecutivo/dashboard-ejecutivo.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent
  },
  {
    path: 'cedente',
    component: DashboardCedenteComponent
  },
  {
    path: 'mis-ofertas',
    component: MisOfertasComponent
  },
  {
    path: 'ejecutivo',
    component: DashboardEjecutivoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardFacturasRoutingModule { }
