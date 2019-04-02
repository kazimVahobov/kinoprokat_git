import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {UserModule} from './user/user.module';
import {TheaterModule} from './theater/theater.module';
import {MovieModule} from './movie/movie.module';
import {RoleModule} from './role/role.module';
import {ProfileModule} from './profile/profile.module';
import {DistributorModule} from './distributor/distributor.module';
import {NotFoundModule} from './not-found/not-found.module';
import {ContractFModule} from './contract-f/contract-f.module';
import {ContractSModule} from './contract-s/contract-s.module';
import {ContractTModule} from './contract-t/contract-t.module';
import {TheaterReportModule} from "./theater-report/theater-report.module";
import {DistributorReportModule} from './distributor-report/distributor-report.module';
import {RkmReportModule} from './rkm-report/rkm-report.module';
import {DetailReportComponent} from './detail-report/detail-report.component';
import {DashboardModule} from './dashboard/dashboard.module';
import { RegionModule } from './region/region.module';
import { StatisticModule } from './statistics/statistic.module';
import { ProfileInstitutionModule } from './profile-institution/profile-institution.module';


const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    {path: '', loadChildren: () => DashboardModule},
    {path: 'detail-report', component: DetailReportComponent},
    {path: 'not-found', loadChildren: () => NotFoundModule},
    {path: 'user', loadChildren: () => UserModule,},
    {path: 'theater', loadChildren: () => TheaterModule},
    {path: 'movie', loadChildren: () => MovieModule},
    {path: 'role', loadChildren: () => RoleModule},
    {path: 'region', loadChildren: () => RegionModule},
    {path: 'profile', loadChildren: () => ProfileModule},
    {path: 'distributor', loadChildren: () => DistributorModule},
    {path: 'statistic', loadChildren: () => StatisticModule},
    {path: 'cont-f', loadChildren: () => ContractFModule},
    {path: 'cont-s', loadChildren: () => ContractSModule},
    {path: 'cont-t', loadChildren: () => ContractTModule},
    {path: 'rkm-report', loadChildren: () => RkmReportModule},
    {path: 'theater-report', loadChildren: () => TheaterReportModule},
    {path: 'distributor-report', loadChildren: () => DistributorReportModule},
    {path: 'profile-institution', loadChildren: () => ProfileInstitutionModule},
    {path: 'not-found', loadChildren: () => NotFoundModule}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
