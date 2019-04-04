import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared';

import { StatisticRoutingModule } from './statistic-routing.module';
import { StatisticsComponent } from './statistics.component';
import { StatisticListComponent } from './statistic-list/statistic-list.component';
import { StatisticRkmComponent } from './statistic-list/statistic-rkm/statistic-rkm.component';

import { StatisticDistComponent } from './statistic-list/statistic-dist/statistic-dist.component';
import { StatisticTheaterComponent } from './statistic-list/statistic-theater/statistic-theater.component';
import { UnconfirmedReportsComponent } from './unconfirmed-reports/unconfirmed-reports.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StatisticRoutingModule

    ],
    declarations: [
        StatisticsComponent,
        StatisticListComponent,
        StatisticRkmComponent,
        UnconfirmedReportsComponent,
        StatisticDistComponent,
        StatisticTheaterComponent
    ]
})
export class StatisticModule {
}
