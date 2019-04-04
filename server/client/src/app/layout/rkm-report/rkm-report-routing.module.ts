import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { RkmReportComponent } from './rkm-report.component';
import { RkmReportListComponent } from './rkm-report-list/rkm-report-list.component';
import { AuthGuardService } from 'src/app/core';



const routes: Routes = [{
  path: '', component: RkmReportComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: RkmReportListComponent}
    // {path: 'distributor', component: DistReportComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rkmReportRoutingModule {
}
