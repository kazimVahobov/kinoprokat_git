import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DistributorComponent} from './distributor.component';
import {DistributorListComponent} from './distributor-list/distributor-list.component';
import {DistributorFormComponent} from './distributor-form/distributor-form.component';
import {DistributorDetailComponent} from './distributor-detail/distributor-detail.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [
  {
    path: '', component: DistributorComponent, canActivate: [AuthGuardService], children: [
      {path: '', component: DistributorListComponent},
      {path: 'new', component: DistributorFormComponent},
      {path: 'edit/:id', component: DistributorFormComponent},
      {path: 'detail/:id', component: DistributorDetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributorRoutingModule {
}
