import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../shared';
import { rkmReportRoutingModule } from './rkm-report-routing.module';
import { RkmReportComponent } from './rkm-report.component';
import { RkmReportListComponent } from './rkm-report-list/rkm-report-list.component';
import { InRepeortComponent } from './rkm-report-list/in-repeort/in-repeort.component';
import { OutRepeortComponent } from './rkm-report-list/out-repeort/out-repeort.component';





@NgModule({
  imports: [
    CommonModule,
    rkmReportRoutingModule,
    SharedModule
  ],
  declarations: [
    RkmReportComponent,
    RkmReportListComponent,
    InRepeortComponent,
    OutRepeortComponent
  ]
})
export class RkmReportModule {
}
