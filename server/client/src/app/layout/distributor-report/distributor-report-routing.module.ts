import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { DistributorReportFormComponent } from './distributor-report-form/distributor-report-form.component';
import { DistributorReportListComponent } from './distributor-report-list/distributor-report-list.component';
import { DistributorReportComponent } from './distributor-report.component';
import { AuthGuardService } from 'src/app/core';


const routes: Routes = [{
  path: '', component: DistributorReportComponent, canActivate: [AuthGuardService],  children: [
    {path: '', component: DistributorReportListComponent},
    {path: 'new', component: DistributorReportFormComponent},
    {path: 'edit/:id', component: DistributorReportFormComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributorReportRoutingModule {
}
