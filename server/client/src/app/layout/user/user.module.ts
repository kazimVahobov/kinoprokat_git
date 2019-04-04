import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import { UserAllComponent } from './user-list/user-all/user-all.component';
import { UserChildComponent } from './user-list/user-child/user-child.component';
import { UserGuestComponent } from './user-list/user-guest/user-guest.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  declarations: [UserComponent, UserListComponent, UserEditComponent, UserAllComponent, UserChildComponent, UserGuestComponent]
})
export class UserModule {
}
