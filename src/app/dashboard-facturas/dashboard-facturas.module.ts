import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardFacturasRoutingModule } from './dashboard-facturas-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    DashboardFacturasRoutingModule
  ]
})
export class DashboardFacturasModule { }
