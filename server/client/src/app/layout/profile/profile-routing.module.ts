import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProfileComponent} from './profile.component';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';

const routes: Routes = [{
  path: '', component: ProfileComponent, children: [
    {path: '', component: ProfileSettingsComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
