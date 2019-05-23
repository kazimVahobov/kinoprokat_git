import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContractFRoutingModule} from './contract-f-routing.module';
import {ContractFFormComponent} from './contract-f-form/contract-f-form.component';
import {ContractFListComponent} from './contract-f-list/contract-f-list.component';
import {ContractFComponent} from './contract-f.component';
import {SharedModule} from '../../shared';
import { ContFDetailComponent } from './cont-f-detail/cont-f-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ContractFRoutingModule,
    SharedModule
  ],
  declarations: [ContractFComponent, ContractFFormComponent, ContractFListComponent, ContFDetailComponent]
})
export class ContractFModule {
}
