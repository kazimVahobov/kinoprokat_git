import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from 'src/app/shared';
import {CinemaRoutingModule} from './movie-routing.module';

import {CinemaComponent} from './movie.component';
import {MovieListComponent} from './movie-list/movie-list.component';
import {MovieFormComponent} from './movie-form/movie-form.component';
import {MovieDetailComponent} from './movie-detail/movie-detail.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {MovieStatisticComponent} from './movie-detail/movie-statistic/movie-statistic.component';
import {MovieContractsComponent} from './movie-detail/movie-contracts/movie-contracts.component';
import {MovieContDetailComponent} from './movie-detail/movie-cont-detail/movie-cont-detail.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PdfViewerModule,
    CinemaRoutingModule
  ],
  declarations: [
    CinemaComponent,
    MovieListComponent,
    MovieFormComponent,
    MovieDetailComponent,
    MovieStatisticComponent,
    MovieContractsComponent,
    MovieContDetailComponent
  ]
})
export class MovieModule {
}
