import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from 'src/app/shared';
import {TheaterRoutingModule} from './theater-routing.module';
import {TheaterComponent} from './theater.component';
import {TheaterListComponent} from './theater-list/theater-list.component';
import {TheaterFormComponent} from './theater-form/theater-form.component';
import {TheaterDetailComponent} from './theater-detail/theater-detail.component';
import { TheaterAllComponent } from './theater-list/theater-all/theater-all.component';
import { TheaterChildComponent } from './theater-list/theater-child/theater-child.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TheaterRoutingModule
  ],
  declarations: [
    TheaterComponent,
    TheaterListComponent,
    TheaterFormComponent,
    TheaterDetailComponent,
    TheaterAllComponent,
    TheaterChildComponent
  ]
})
export class TheaterModule {
}
