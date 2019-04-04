import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared';
import { ProfileInstitutionComponent } from './profile-institution.component';
import { ProfileRkmComponent } from './profile-rkm/profile-rkm.component';
import { ProfileTheaterComponent } from './profile-theater/profile-theater.component';
import { ProfileInstitutionRoutingModule } from './profile-institution-routing.module';
import { EditTheaterComponent } from './edit-theater/edit-theater.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';



@NgModule({
  imports: [
    CommonModule,
    ProfileInstitutionRoutingModule,
    SharedModule
  ],
  declarations: [
      ProfileInstitutionComponent,
       ProfileRkmComponent,
        ProfileTheaterComponent,
        EditTheaterComponent,
        ProfileDetailComponent
     ]
})
export class ProfileInstitutionModule {
}
