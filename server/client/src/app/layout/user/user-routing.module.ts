import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from './user.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: UserComponent, canActivate: [AuthGuardService],  children: [
    {path: '', component: UserListComponent},
    {path: 'new', component: UserEditComponent},
    {path: 'edit/:id', component: UserEditComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
