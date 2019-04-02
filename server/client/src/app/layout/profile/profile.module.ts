import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {SharedModule} from 'src/app/shared';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {ProfilePasswordEditComponent} from './profile-password-edit/profile-password-edit.component';
import {ProfileAvatarEditComponent} from './profile-avatar-edit/profile-avatar-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent,
    ProfileSettingsComponent,
    ProfileEditComponent,
    ProfileAvatarEditComponent,
    ProfilePasswordEditComponent
  ]
})
export class ProfileModule {
}
