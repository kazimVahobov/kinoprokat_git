import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheaterReportRoutingModule } from './theater-report-routing.module';
import { TheaterReportComponent } from './theater-report.component';
import { TheaterReportFormComponent } from './theater-report-form/theater-report-form.component';
import { TheaterReportListComponent } from './theater-report-list/theater-report-list.component';

import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    TheaterReportRoutingModule,
    SharedModule
  ],
  declarations: [
    TheaterReportComponent,
    TheaterReportFormComponent,
    TheaterReportListComponent
  ]
})
export class TheaterReportModule {
}
