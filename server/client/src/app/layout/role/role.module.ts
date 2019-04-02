import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared';
import {RoleRoutingModule} from './role-routing.module';
import {RoleListComponent} from './role-list/role-list.component';
import {RoleComponent} from './role.component';
import {RoleFormComponent} from './role-form/role-form.component';
import {RoleDetailComponent} from './role-detail/role-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule
  ],
  declarations: [RoleListComponent, RoleComponent, RoleFormComponent, RoleDetailComponent]
})
export class RoleModule {
}
