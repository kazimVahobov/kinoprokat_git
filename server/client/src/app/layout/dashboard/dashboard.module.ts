import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {DashRkmComponent} from './dash-rkm/dash-rkm.component';
import {DashDistComponent} from './dash-dist/dash-dist.component';
import {DashTheaterComponent} from './dash-theater/dash-theater.component';
import {SharedModule} from "../../shared";
import { DashGuestComponent } from './dash-guest/dash-guest.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent, DashRkmComponent, DashDistComponent, DashTheaterComponent, DashGuestComponent]
})
export class DashboardModule {
}
