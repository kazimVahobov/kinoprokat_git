import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CinemaComponent} from './movie.component';
import {MovieListComponent} from './movie-list/movie-list.component';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {MovieDetailComponent} from './movie-detail/movie-detail.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: CinemaComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: MovieListComponent},
    {path: 'new', component: MovieFormComponent},
    {path: 'edit/:id', component: MovieFormComponent},
    {path: 'detail/:id', component: MovieDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CinemaRoutingModule {
}
