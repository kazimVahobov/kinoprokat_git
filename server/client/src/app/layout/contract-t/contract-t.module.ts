import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContractTRoutingModule} from './contract-t-routing.module';
import {ContractTListComponent} from './contract-t-list/contract-t-list.component';
import {ContractTFormComponent} from './contract-t-form/contract-t-form.component';
import {ContractTComponent} from './contract-t.component';
import {SharedModule} from '../../shared';
import {ContTAllComponent} from './contract-t-list/cont-t-all/cont-t-all.component';
import {ContTChildComponent} from './contract-t-list/cont-t-child/cont-t-child.component';
import {ContTDetailComponent} from "./cont-t-detail/cont-t-detail.component";

@NgModule({
  imports: [
    CommonModule,
    ContractTRoutingModule,
    SharedModule
  ],
  declarations: [ContractTComponent, ContractTListComponent, ContractTFormComponent, ContTAllComponent, ContTChildComponent, ContTDetailComponent]
})
export class ContractTModule {
}
