import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../shared';

import { DistributorReportComponent } from './distributor-report.component';
import { DistributorReportFormComponent } from './distributor-report-form/distributor-report-form.component';
import { DistributorReportListComponent } from './distributor-report-list/distributor-report-list.component';
import { DistributorReportRoutingModule } from './distributor-report-routing.module';
import { InReportComponent } from './distributor-report-list/in-report/in-report.component';
import { OutReportComponent } from './distributor-report-list/out-report/out-report.component';

@NgModule({
  imports: [
    CommonModule,
    DistributorReportRoutingModule,
    SharedModule
  ],
  declarations: [
    DistributorReportComponent,
    DistributorReportFormComponent,
    DistributorReportListComponent,
    InReportComponent,
    OutReportComponent
  ]
})
export class DistributorReportModule {
}
