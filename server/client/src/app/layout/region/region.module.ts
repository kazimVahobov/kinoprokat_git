import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared';
import { RegionComponent } from './region.component';
import { RegionRoutingModule } from './region-routing.module';
import { RegionListComponent } from './region-list/region-list.component';


@NgModule({
  imports: [
    CommonModule,
    RegionRoutingModule,
    SharedModule
  ],
  declarations: [RegionComponent, RegionListComponent]
})
export class RegionModule {
}
