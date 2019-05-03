import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CinemaComponent} from './movie.component';
import {MovieListComponent} from './movie-list/movie-list.component';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {MovieDetailComponent} from './movie-detail/movie-detail.component';
import {AuthGuardService} from 'src/app/core';
import {MovieContDetailComponent} from "./movie-detail/movie-cont-detail/movie-cont-detail.component";

const routes: Routes = [{
  path: '', component: CinemaComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: MovieListComponent},
    {path: 'new', component: MovieFormComponent},
    {path: 'edit/:id', component: MovieFormComponent},
    {path: 'detail/:id', component: MovieDetailComponent},
    {path: 'detail/:id/cont-detail/:id', component: MovieContDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CinemaRoutingModule {
}
