import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContractSRoutingModule} from './contract-s-routing.module';
import {ContractSListComponent} from './contract-s-list/contract-s-list.component';
import {ContractSFormComponent} from './contract-s-form/contract-s-form.component';
import {ContractSComponent} from './contract-s.component';
import {SharedModule} from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    ContractSRoutingModule,
    SharedModule
  ],
  declarations: [ContractSComponent, ContractSListComponent, ContractSFormComponent]
})
export class ContractSModule {
}
