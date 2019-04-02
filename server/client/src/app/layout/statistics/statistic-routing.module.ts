import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AuthGuardService } from 'src/app/core';
import { StatisticsComponent } from './statistics.component';
import { StatisticListComponent } from './statistic-list/statistic-list.component';
import { UnconfirmedReportsComponent } from './unconfirmed-reports/unconfirmed-reports.component';

const routes: Routes = [{
  path: '', component: StatisticsComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: StatisticListComponent},
    {path: 'report', component: UnconfirmedReportsComponent}
    // {path: 'edit/:id', component: MovieFormComponent},
    // {path: 'detail/:id', component: MovieDetailComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule {
}
