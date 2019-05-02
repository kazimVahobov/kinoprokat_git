import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContractSComponent} from './contract-s.component';
import {ContractSListComponent} from './contract-s-list/contract-s-list.component';
import {ContractSFormComponent} from './contract-s-form/contract-s-form.component';
import {AuthGuardService} from 'src/app/core';
import {ContSDetailComponent} from "./cont-s-detail/cont-s-detail.component";

const routes: Routes = [{
  path: '', component: ContractSComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: ContractSListComponent},
    {path: 'new', component: ContractSFormComponent},
    {path: 'edit/:id', component: ContractSFormComponent},
    {path: 'detail/:id', component: ContSDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractSRoutingModule {
}
