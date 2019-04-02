import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from 'src/app/core';
import { RegionComponent } from './region.component';
import { RegionListComponent } from './region-list/region-list.component';

const routes: Routes = [{
  path: '', component: RegionComponent, canActivate: [AuthGuardService],  children: [
    {path: '', component: RegionListComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule {
}
