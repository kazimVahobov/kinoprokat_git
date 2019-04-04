import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ProfileInstitutionComponent } from './profile-institution.component';
import { EditTheaterComponent } from './edit-theater/edit-theater.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

const routes: Routes = [{
  path: '', component: ProfileInstitutionComponent, children: [
    {path: '', component: ProfileDetailComponent},
    {path: 'edit/:id', component: EditTheaterComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileInstitutionRoutingModule {
}
