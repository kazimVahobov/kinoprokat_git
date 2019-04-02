import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContractFComponent} from './contract-f.component';
import {ContractFListComponent} from './contract-f-list/contract-f-list.component';
import {ContractFFormComponent} from './contract-f-form/contract-f-form.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: ContractFComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: ContractFListComponent},
    {path: 'new', component: ContractFFormComponent},
    {path: 'edit/:id', component: ContractFFormComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractFRoutingModule {
}
