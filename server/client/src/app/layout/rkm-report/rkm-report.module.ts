import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {SharedModule} from '../../shared';
import {rkmReportRoutingModule} from './rkm-report-routing.module';
import {RkmReportComponent} from './rkm-report.component';
import {RkmReportListComponent} from './rkm-report-list/rkm-report-list.component';
import {TheaterInReportComponent} from './rkm-report-list/theater-in-report/theater-in-report.component';
import {DistInReportComponent} from './rkm-report-list/dist-in-report/dist-in-report.component';


@NgModule({
  imports: [
    CommonModule,
    rkmReportRoutingModule,
    SharedModule
  ],
  declarations: [
    RkmReportComponent,
    RkmReportListComponent,
    TheaterInReportComponent,
    DistInReportComponent
  ]
})
export class RkmReportModule {
}
