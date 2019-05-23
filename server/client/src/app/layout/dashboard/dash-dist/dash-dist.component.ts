import {Component, OnInit} from '@angular/core';
import {
  DistributorModel, DistributorReportModel,
  DistributorReportService,
  DistributorService,
  PagerService,
  TheaterReportModel
} from 'src/app/core';
import {StatisticService} from "../../../core/services/statistic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dash-dist',
  templateUrl: './dash-dist.component.html',
  styleUrls: ['./dash-dist.component.scss']
})
export class DashDistComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
  currentDist: DistributorModel;
  todayReport: any;
  reportStatus = null;  // if 0 - no report/ 1 - saved/ 2 - sent/ 3 - confirmed
  movies: any[] = [];
  theaters: any[] = [];
  // first chart - by date of one movie
  singleMovieChIsTicket: boolean = true;
  singleMovieChIsOpen: boolean = true;
  singleMovieChMovieId: string = null;
  singleMovieChData: any[];
  singleMovieChOverall: any = {
    ticketCount: 0,
    sum: 0
  };
  singleMovieChLabelY: string;
  singleMovieChTheaterId: string = null;
  singleMovieChTheaterData: any[];
  singleMovieChLoadData: boolean = false;
  singleMovieChTheaterLoadData: boolean = false;
  // table of theaters
  tableMoviesIsOpen = true;

  constructor(private pagerService: PagerService,
              private distReportService: DistributorReportService,
              public statisticService: StatisticService,
              private distributorService: DistributorService,
              private router: Router) {
  }

  ngOnInit() {
    this.distributorService.getById(this.currentUser.distId).subscribe(data => this.currentDist = data);
    this.statisticService.getTheatersWithName(this.currentUser.distId).subscribe(data => {
      this.theaters = data;
      this.singleMovieChTheaterId = this.theaters[0]._id;
    });
    this.distReportService.getOneReportByDate(this.currentUser.distId, this.currentDate).subscribe(report => {
      if (report == null) {
        this.reportStatus = 0;
      } else {
        this.setTodayReportStatus(report);
      }
    });
    this.statisticService.getMoviesWithNameByDistId(this.currentUser.distId).subscribe(data => {
      this.movies = data;
      this.singleMovieChMovieId = this.movies[0]._id;
      this.changeMovie();
      this.loadTable();
    });
  }

  loadTable() {
    this.statisticService.filterByOneDistId(this.currentUser.distId).subscribe(data => this.setPage(1, data));
  }

  changeMovie() {
    this.singleMovieChLoadData = false;
    let type = this.singleMovieChIsTicket ? 'ticketCount' : 'sum';
    this.singleMovieChLabelY = this.singleMovieChIsTicket ? 'Всего продано' : 'Общая сумма';
    this.statisticService.getOverallDataOfMovie(this.singleMovieChMovieId, this.currentUser.distId, null).subscribe(data => {
      this.singleMovieChData = data.moviesData.map(item => {
        return {
          name: item.label,
          value: item[type]
        }
      });
      this.singleMovieChOverall = {
        ticketCount: data.totalTicketCount,
        sum: data.totalSum
      };
      this.singleMovieChLoadData = true;
      this.changeTheater();
    });
  }

  changeTheater() {
    this.singleMovieChTheaterLoadData = false;
    let type = this.singleMovieChIsTicket ? 'ticketCount' : 'sum';
    this.statisticService.getOverallDataOfMovie(this.singleMovieChMovieId, this.currentUser.distId, this.singleMovieChTheaterId).subscribe(data => {
      this.singleMovieChTheaterData = data.moviesData.map(item => {
        return {
          name: item.label,
          value: item[type]
        }
      });
      this.singleMovieChTheaterLoadData = true;
    });
  }

  detailRouter(id: string, type: string) {
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: type}
    });
  }

  setTodayReportStatus(report: DistributorReportModel) {
    if (report.sent && report.confirm) {
      this.reportStatus = 3;
    } else if (report.sent && !report.confirm) {
      this.reportStatus = 2;
    } else if (!report.sent && !report.confirm) {
      this.reportStatus = 1;
    }
    let _ticketCount: number = 0;
    let _sum: number = 0;
    report.mobileTheaters.forEach(session => {
      _ticketCount += session.childTicketCount + session.adultTicketCount;
      _sum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
    });
    this.todayReport = {
      _id: report._id,
      ticketCount: _ticketCount,
      sum: _sum
    };
  }

  setPage(page: number, data: any[]) {
    this.pager = this.pagerService.getPager(data.length, page);
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
