import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContractFComponent} from './contract-f.component';
import {ContractFListComponent} from './contract-f-list/contract-f-list.component';
import {ContractFFormComponent} from './contract-f-form/contract-f-form.component';
import {AuthGuardService} from 'src/app/core';
import {ContFDetailComponent} from "./cont-f-detail/cont-f-detail.component";

const routes: Routes = [{
  path: '', component: ContractFComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: ContractFListComponent},
    {path: 'new', component: ContractFFormComponent},
    {path: 'edit/:id', component: ContractFFormComponent},
    {path: 'detail/:id', component: ContFDetailComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractFRoutingModule {
}
