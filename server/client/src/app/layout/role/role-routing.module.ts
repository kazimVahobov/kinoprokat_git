import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RoleListComponent} from './role-list/role-list.component';
import {RoleComponent} from './role.component';
import {RoleFormComponent} from './role-form/role-form.component';
import {RoleDetailComponent} from './role-detail/role-detail.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: RoleComponent, canActivate: [AuthGuardService],  children: [
    {path: '', component: RoleListComponent},
    {path: 'new', component: RoleFormComponent},
    {path: 'edit/:id', component: RoleFormComponent},
    {path: 'detail/:id', component: RoleDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {
}
