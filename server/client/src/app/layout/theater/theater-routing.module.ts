import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TheaterComponent} from './theater.component';
import {TheaterListComponent} from './theater-list/theater-list.component';
import {TheaterFormComponent} from './theater-form/theater-form.component';
import {TheaterDetailComponent} from './theater-detail/theater-detail.component';
import { AuthGuardService } from 'src/app/core';


const routes: Routes = [{
  path: '', component: TheaterComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: TheaterListComponent},
    {path: 'new', component: TheaterFormComponent},
    {path: 'edit/:id', component: TheaterFormComponent},
    {path: 'detail/:id', component: TheaterDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheaterRoutingModule {
}
