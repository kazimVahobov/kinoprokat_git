import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContractTComponent} from './contract-t.component';
import {ContractTListComponent} from './contract-t-list/contract-t-list.component';
import {ContractTFormComponent} from './contract-t-form/contract-t-form.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: ContractTComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: ContractTListComponent},
    {path: 'new', component: ContractTFormComponent},
    {path: 'edit/:id', component: ContractTFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractTRoutingModule { }
