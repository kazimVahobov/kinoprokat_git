import {Component, Input, OnInit} from '@angular/core';
import {
  DistributorModel,
  DistributorReportService,
  DistributorService,
  TheaterModel,
  TheaterService
} from "../../../../core";
import {StatisticService} from "../../../../core/services/statistic.service";

declare var $;

@Component({
  selector: 'app-movie-statistic',
  templateUrl: './movie-statistic.component.html',
  styleUrls: ['./movie-statistic.component.scss']
})
export class MovieStatisticComponent implements OnInit {

  @Input() movieId: string;
  @Input() movieName: string;
  selectedDistId: string;
  selectedTheaterId: string;
  distributors: DistributorModel[];
  theaters: TheaterModel[];
  listOfReports: MainFilter[] = [];

  constructor(private distributorService: DistributorService,
              private theaterService: TheaterService,
              private distributorReportService: DistributorReportService,
              public statisticService: StatisticService) {
  }

  ngOnInit() {
    this.distributors = [];
    this.theaters = [];
    this.selectedDistId = null;
    this.selectedTheaterId = null;
    this.distributorService.getAll().subscribe(data => {
      this.distributors = data;
    });
    this.loadMainFilter();
  }

  changeDist() {
    if (this.selectedDistId != null) {
      this.theaterService.getAll().subscribe(theaters => {
        this.selectedTheaterId = null;
        this.theaters = theaters.filter(item => item.distId === this.selectedDistId);
      });
      this.loadMainFilter(this.selectedDistId);
    } else {
      this.loadMainFilter();
    }
  }

  changeTheater() {
    if (this.selectedDistId != null && this.selectedTheaterId != null) {
      this.loadMainFilter(this.selectedDistId, this.selectedTheaterId);
    } else if (this.selectedDistId != null && this.selectedTheaterId == null) {
      this.loadMainFilter(this.selectedDistId);
    } else if (this.selectedDistId == null && this.selectedTheaterId == null) {
      this.loadMainFilter();
    }
  }

  loadMainFilter(distId?: string, theaterId?: string) {
    this.listOfReports = [];
    if (distId && !theaterId) {
      this.statisticService.filterByMovieId(this.movieId, distId).subscribe(data => {
        this.listOfReports = data;
      }, error1 => {
        console.log(error1.toString());
      });
    } else if (distId && theaterId) {
      this.statisticService.filterByMovieId(this.movieId, distId, theaterId).subscribe(data => {
        this.listOfReports = data;
      }, error1 => {
        console.log(error1.toString());
      });
    } else if (!distId && !theaterId) {
      this.statisticService.filterByMovieId(this.movieId).subscribe(data => {
        this.listOfReports = data;
      }, error1 => {
        console.log(error1.toString());
      });
    }
  }

  totalizeOfReports(reports: MainFilter[], mode: string): number {
    let result: number = 0;

    switch (mode) {
      case 'day-child-count': {
        reports.forEach(item => result += item.daySession.childCount);
        break;
      }
      case 'day-child-sum': {
        reports.forEach(item => result += item.daySession.childSum);
        break;
      }
      case 'day-adult-count': {
        reports.forEach(item => result += item.daySession.adultCount);
        break;
      }
      case 'day-adult-sum': {
        reports.forEach(item => result += item.daySession.adultSum);
        break;
      }
      case 'evening-child-count': {
        reports.forEach(item => result += item.eveningSession.childCount);
        break;
      }
      case 'evening-child-sum': {
        reports.forEach(item => result += item.eveningSession.childSum);
        break;
      }
      case 'evening-adult-count': {
        reports.forEach(item => result += item.eveningSession.adultCount);
        break;
      }
      case 'evening-adult-sum': {
        reports.forEach(item => result += item.eveningSession.adultSum);
        break;
      }
      case 'overall-count': {
        reports.forEach(item => result +=
          item.daySession.childCount + item.daySession.adultCount + item.eveningSession.childCount + item.eveningSession.adultCount);
        break;
      }
      case 'overall-sum': {
        reports.forEach(item => result +=
          item.daySession.childSum + item.daySession.adultSum + item.eveningSession.childSum + item.eveningSession.adultSum);
        break;
      }
    }

    return result;
  }

  isExistsTheater(): boolean {
    return !!this.theaters.find(item => item.distId === this.selectedDistId);
  }

  print() {
    $("#statistic-print").print();
  }

}

class MainFilter {
  label: string;
  daySession?: SessionOfDetailFilter = new SessionOfDetailFilter();
  eveningSession?: SessionOfDetailFilter = new SessionOfDetailFilter();
}

class SessionOfDetailFilter {
  childCount: number;
  childSum: number;
  adultCount: number;
  adultSum: number;
}
