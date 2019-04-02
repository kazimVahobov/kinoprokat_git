import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributorRoutingModule } from './distributor-routing.module';
import { DistributorComponent } from './distributor.component';
import { DistributorListComponent } from './distributor-list/distributor-list.component';
import { DistributorDetailComponent } from './distributor-detail/distributor-detail.component';
import { DistributorFormComponent } from './distributor-form/distributor-form.component';
import {SharedModule} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    DistributorRoutingModule,
    SharedModule,
  ],
  declarations: [DistributorComponent, DistributorListComponent, DistributorDetailComponent, DistributorFormComponent]
})
export class DistributorModule { }
