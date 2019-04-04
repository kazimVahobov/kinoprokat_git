import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';

import {LayoutRoutingModule} from './layout-routing.module';
import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import {DetailReportComponent} from './detail-report/detail-report.component';
import {SharedModule} from '../shared';


@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgSelectModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DetailReportComponent
  ]
})
export class LayoutModule {
}
