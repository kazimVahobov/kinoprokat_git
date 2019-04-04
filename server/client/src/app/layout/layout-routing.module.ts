import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {DetailReportComponent} from './detail-report/detail-report.component';


const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    {path: '', loadChildren: './dashboard/dashboard.module#DashboardModule'},
    {path: 'detail-report', component: DetailReportComponent},
    {path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule'},
    {path: 'user', loadChildren: './user/user.module#UserModule',},
    {path: 'theater', loadChildren: './theater/theater.module#TheaterModule'},
    {path: 'movie', loadChildren: './movie/movie.module#MovieModule'},
    {path: 'role', loadChildren: './role/role.module#RoleModule'},
    {path: 'region', loadChildren: './region/region.module#RegionModule'},
    {path: 'profile', loadChildren: './profile/profile.module#ProfileModule'},
    {path: 'distributor', loadChildren: './distributor/distributor.module#DistributorModule'},
    {path: 'statistic', loadChildren: './statistics/statistic.module#StatisticModule'},
    {path: 'cont-f', loadChildren: './contract-f/contract-f.module#ContractFModule'},
    {path: 'cont-s', loadChildren: './contract-s/contract-s.module#ContractSModule'},
    {path: 'cont-t', loadChildren: './contract-t/contract-t.module#ContractTModule'},
    {path: 'rkm-report', loadChildren: './rkm-report/rkm-report.module#RkmReportModule'},
    {path: 'theater-report', loadChildren: './theater-report/theater-report.module#TheaterReportModule'},
    {path: 'distributor-report', loadChildren: './distributor-report/distributor-report.module#DistributorReportModule'},
    {path: 'profile-institution', loadChildren: './profile-institution/profile-institution.module#ProfileInstitutionModule'},
    {path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
