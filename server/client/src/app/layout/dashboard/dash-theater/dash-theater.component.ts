import {Component, OnInit} from '@angular/core';
import {PagerService, TheaterModel, TheaterReportModel, TheaterReportService, TheaterService} from "../../../core";
import {StatisticService} from "../../../core/services/statistic.service";

@Component({
  selector: 'app-dash-theater',
  templateUrl: './dash-theater.component.html',
  styleUrls: ['./dash-theater.component.scss']
})
export class DashTheaterComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
  currentTheater: TheaterModel = new TheaterModel();
  todayReport: any;
  reportStatus = null;  // if 0 - no report/ 1 - saved/ 2 - sent/ 3 - confirmed
  movies: any[] = [];
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
  // table of theaters
  tableMoviesIsOpen = true;

  constructor(private pagerService: PagerService,
              private theaterService: TheaterService,
              private thReportService: TheaterReportService,
              private statisticService: StatisticService) {
  }

  ngOnInit(): void {
    this.theaterService.getById(this.currentUser.theaterId).subscribe(theater => this.currentTheater = theater);
    this.thReportService.getReportByDate(this.currentUser.theaterId, this.currentDate).subscribe(report => {
      if (report == null) {
        this.reportStatus = 0;
      } else {
        this.setTodayReportStatus(report);
      }
    });
    this.statisticService.getMoviesWithNameByThReports(this.currentUser.theaterId).subscribe(data => {
      this.movies = data;
      this.singleMovieChMovieId = this.movies[0]._id;
      this.changeMovie();
      this.loadTable();
    });
  }

  loadTable() {
    this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId).subscribe(data => this.setPage(1, data));
  }

  changeMovie() {
    let type = this.singleMovieChIsTicket ? 'ticketCount' : 'sum';
    this.singleMovieChLabelY = this.singleMovieChIsTicket ? 'Всего продано' : 'Общая сумма';
    this.theaterService.getById(this.currentUser.theaterId).subscribe(theater => {
      this.statisticService.getOverallDataOfMovie(this.singleMovieChMovieId, theater.distId, theater._id).subscribe(data => {
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
      });
    });
  }

  setTodayReportStatus(report: TheaterReportModel) {
    if (report.sent && report.confirm) {
      this.reportStatus = 3;
    } else if (report.sent && !report.confirm) {
      this.reportStatus = 2;
    } else if (!report.sent && !report.confirm) {
      this.reportStatus = 1;
    }
    let _ticketCount: number = 0;
    let _sum: number = 0;
    report.withCont.forEach(session => {
      _ticketCount += session.childTicketCount + session.adultTicketCount;
      _sum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
    });
    this.todayReport = {
      ticketCount: _ticketCount,
      sum: _sum
    };
  }

  setPage(page: number, data: any[]) {
    this.pager = this.pagerService.getPager(data.length, page);
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


}
