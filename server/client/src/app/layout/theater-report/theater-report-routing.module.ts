import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TheaterReportComponent} from './theater-report.component';
import {TheaterReportListComponent} from './theater-report-list/theater-report-list.component';
import {TheaterReportFormComponent} from './theater-report-form/theater-report-form.component';
import { AuthGuardService } from 'src/app/core';

const routes: Routes = [{
  path: '', component: TheaterReportComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: TheaterReportListComponent},
    {path: 'new', component: TheaterReportFormComponent},
    {path: 'edit/:id', component: TheaterReportFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheaterReportRoutingModule {
}
