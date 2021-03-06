import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContentWrapperComponent, ValidationSummaryComponent} from './components';
import {ManualPipe} from './pipes/manual.pipe';
import {SumPipe} from './pipes/sum.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {
  AccordionModule,
  BsDatepickerModule, ButtonsModule,
  ModalModule,
  PaginationModule,
  PopoverModule, TabsModule
} from 'ngx-bootstrap';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MonthPipe} from "./pipes/month.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    NgxMaterialTimepickerModule.forRoot(),
    AccordionModule.forRoot(),
    NgxChartsModule,
    ButtonsModule.forRoot(),
    TabsModule.forRoot()
  ],
  declarations: [
    ContentWrapperComponent,
    ValidationSummaryComponent,
    ManualPipe,
    MonthPipe,
    SumPipe
  ],
  exports: [
    ContentWrapperComponent,
    ValidationSummaryComponent,
    FormsModule,
    ManualPipe,
    MonthPipe,
    SumPipe,
    NgSelectModule,
    ModalModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    ModalModule,
    BsDatepickerModule,
    PopoverModule,
    PaginationModule,
    NgxMaterialTimepickerModule,
    AccordionModule,
    NgxChartsModule,
    ButtonsModule,
    TabsModule
  ]
})
export class SharedModule {
}
