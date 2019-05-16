import { Component, OnInit } from '@angular/core';
import {
  PagerService,
  MovieModel,
  TheaterModel,
  MovieService,
  TheaterService,
  TheaterReportService,
  TheaterReportModel,
  YearListService
} from 'src/app/core';
import * as moment from 'moment';
import {daLocale} from "ngx-bootstrap";

@Component({
  selector: 'app-dash-theater',
  templateUrl: './dash-theater.component.html',
  styleUrls: ['./dash-theater.component.scss']
})
export class DashTheaterComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
  reportStatus = 1;  // if 0 - no report/ 1 - saved/ 2 - sent/ 3 - confirmed
  months = [
    {
      name: 'Весь год',
      value: 12
    },
    {
      name: 'Январь',
      value: 0
    },
    {
      name: 'Февраль',
      value: 1
    },
    {
      name: 'Март',
      value: 2
    },
    {
      name: 'Апрель',
      value: 3
    },
    {
      name: 'Май',
      value: 4
    },
    {
      name: 'Июнь',
      value: 5
    },
    {
      name: 'Июль',
      value: 6
    },
    {
      name: 'Август',
      value: 7
    },
    {
      name: 'Сентябрь',
      value: 8
    },
    {
      name: 'Октябрь',
      value: 9
    },
    {
      name: 'Ноябрь',
      value: 10
    },
    {
      name: 'Декабрь',
      value: 11
    }
  ];
  tempColors: string[] = [
    '#3f51b5',
    '#e91e63',
    '#03a9f4',
    '#9c27b0',
    '#2196f3',
    '#ffc107',
    '#ff5722',
    '#9c27b0',
    '#f44336',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#673ab7',
    '#8bc34a',
    '#ff9800'];
  selectedYearTheater: number;
  //


  movies: MovieModel[];
  currentTheater: TheaterModel;
  theatersOneRegion: TheaterModel[];
  pager: any = {};
  pagedItems: any[];

  currentTheaterReport: TheaterReportModel;
  theaterReports: TheaterReportModel[];
  allTheaterReports: TheaterReportModel[];

  theaterReport: TotalReport;
  totalReport: TotalReport;

  chartReport: TheaterReport;

  moviesTable: MovieTableRow[] = [];
  movieTable: MovieTableRow;

  yearList: Year[];

  // singleMovieChart
  singleMovieChIsOpen = true;
  singleMovieChMode = 0;
  singleMovieChMovieId: string;
  singleMovieChTheaterId: string;
  singleMovieChCommonData: Series[] = [];
  singleMovieChTheaterData: Series[] = [];
  singleMovieChCommonColors: Color;
  singleMovieChTheaterColors: Color;
  singleMovieChLabelY = 'Всего билетов';
  // table of theaters
  tableMoviesIsOpen = true;
  
  reportsOneTheater: TotalRegionReport;
  regionReports: TotalRegionReport;
  regionTempReport: RegionReport;

  constructor(private service: TheaterService,
    private movieService: MovieService,
    private pagerService: PagerService,
    private theaterReportService: TheaterReportService,
    private yearListService: YearListService
  ) {
  }

  ngOnInit() {
    this.movies = [];
    this.currentTheaterReport = new TheaterReportModel();
    this.currentTheater = new TheaterModel();
    this.theaterReports = [];
    this.yearList = [];
    this.theatersOneRegion = [];
    this.allTheaterReports = [];
    this.yearListService.getYearList().subscribe(data => this.yearList = data);

    this.service.getAll().subscribe(theater => {
      this.movieService.getAll().subscribe(movies => {
        this.theaterReportService.getAll().subscribe(theaterReports => {

          this.currentTheater = theater.find(th => th._id === this.currentUser.theaterId);
          this.theatersOneRegion = theater.filter(th => th.regionId === this.currentTheater.regionId)
          this.selectedYearTheater = this.yearList[0].value

          this.currentTheaterReport = theaterReports.find(r => r.theaterId === this.currentUser.theaterId &&
            new Date(r.date).toDateString() === this.currentDate.toDateString())

          this.theaterReports = theaterReports.filter(r => r.theaterId === this.currentUser.theaterId
            && r.sent === true && r.confirm === true);
          this.allTheaterReports = theaterReports.filter(r => r.sent === true && r.confirm === true);
          if (this.currentTheaterReport) {
            if (this.currentTheaterReport.sent) {
              this.reportStatus = 2;
              if (this.currentTheaterReport.confirm) {
                this.reportStatus = 3;
              }
            } else {
              this.reportStatus = 1;
            }
          } else {
            this.reportStatus = 0
          }
          this.loadData();
          this.movies = movies;
          this.singleMovieChMovieId = movies[0]._id

          movies.forEach(movie => {
            this.movieTable = new MovieTableRow();
            this.movieTable.name = movie.name
            this.movieTable._id = movie._id
            this.movieTable.overall = 0;
            this.movieTable.ticketCount = 0;
            this.movieTable.sessionCount = 0;
            theaterReports.forEach(report => {
              report.withCont.forEach(rw => {
                if (rw.movieId === movie._id) {
                  this.movieTable.overall += rw.price * rw.ticketCount;
                  this.movieTable.ticketCount += rw.ticketCount;
                  this.movieTable.sessionCount += 1;
                }
              });
            });
            this.movieTable.price = this.movieTable.overall / this.movieTable.ticketCount
            this.moviesTable.push(this.movieTable);
          });
          this.setPage(1);
          this.changeMovie();
        });
      });
    });

  }
  loadData() {
    //Current Report
    this.theaterReport = new TotalReport();
    this.theaterReport.movies = [];
    this.theaterReport.sessionCount = 0;
    this.theaterReport.summ = 0;
    this.theaterReport.ticketCount = 0;

    if (this.currentTheaterReport && this.currentTheaterReport.withCont) {
      for (let j = 0; j < this.currentTheaterReport.withCont.length; j++) {
        this.theaterReport.sessionCount += 1;
        this.theaterReport.ticketCount += this.currentTheaterReport.withCont[j].ticketCount;
        this.theaterReport.summ += this.currentTheaterReport.withCont[j].ticketCount * this.currentTheaterReport.withCont[j].price;
        this.theaterReport.movies.push(this.currentTheaterReport.withCont[j].movieId);
      }
    }
    //TotalReport
    this.totalReport = new TotalReport();
    this.totalReport.movies = [];
    this.totalReport.sessionCount = 0;
    this.totalReport.summ = 0;
    this.totalReport.ticketCount = 0;

    //Theater Reports
    if (this.theaterReports) {
      for (let i = 0; i < this.theaterReports.length; i++) {
        this.totalReport.summ = 0;
        for (let j = 0; j < this.theaterReports[i].withCont.length; j++) {
          this.totalReport.sessionCount += 1;
          this.totalReport.ticketCount += this.theaterReports[i].withCont[j].ticketCount;
          this.totalReport.summ += this.theaterReports[i].withCont[j].ticketCount * this.theaterReports[i].withCont[j].price;
          this.totalReport.movies.push(this.theaterReports[i].withCont[j].movieId);
        }
        this.totalReport.summTotal += this.totalReport.summ;
      }
    }
  }

  changeMovie() {

    this.regionReports = new TotalRegionReport();
    this.regionReports.regionReport = [];
    this.regionReports.totalAmount = 0;
    this.regionReports.totlaTicketCount = 0;

    for (let a = 0; a < this.theatersOneRegion.length; a++) {
      var theaterReportOneTheater = this.allTheaterReports.filter(r => r.theaterId === this.theatersOneRegion[a]._id)
      this.regionTempReport = new RegionReport();
      this.regionTempReport.amount = 0;
      this.regionTempReport.ticketCount = 0;
      this.regionTempReport.name = this.theatersOneRegion[a].name;
      for (let i = 0; i < theaterReportOneTheater.length; i++) {
        for (let j = 0; j < theaterReportOneTheater[i].withCont.length; j++) {
          if (theaterReportOneTheater[i].withCont[j].movieId === this.singleMovieChMovieId) {
            this.regionTempReport.amount += theaterReportOneTheater[i].withCont[j].price * theaterReportOneTheater[i].withCont[j].ticketCount;
            this.regionTempReport.ticketCount += theaterReportOneTheater[i].withCont[j].ticketCount;
          }
        }
      }

      if (this.regionTempReport) {
        this.regionReports.totalAmount += this.regionTempReport.amount;
        this.regionReports.totlaTicketCount += this.regionTempReport.ticketCount;
        this.regionReports.regionReport.push(this.regionTempReport);
      }

    }
    this.singleMovieChMode = 0;
    this.changeRegion();
  }

  changeRegion() {
    if (this.currentTheater) {
      this.reportsOneTheater = new TotalRegionReport();
      this.reportsOneTheater.regionReport = [];
      this.reportsOneTheater.totalAmount = 0;
      this.reportsOneTheater.totlaTicketCount = 0;
      for (let a = 0; a < this.currentTheater.holes.length; a++) {
        this.regionTempReport = new RegionReport();
        this.regionTempReport.amount = 0;
        this.regionTempReport.ticketCount = 0;
        this.regionTempReport.name = this.currentTheater.holes[a].name
        if (this.theaterReports) {
          for (let i = 0; i < this.theaterReports.length; i++) {
            for (let j = 0; j < this.theaterReports[i].withCont.length; j++) {
              if (this.theaterReports[i].withCont[j].movieId === this.singleMovieChMovieId &&
                this.theaterReports[i].withCont[j].holeId === this.currentTheater.holes[a]._id) {
                this.regionTempReport.amount += this.theaterReports[i].withCont[j].price * this.theaterReports[i].withCont[j].ticketCount;
                this.regionTempReport.ticketCount += this.theaterReports[i].withCont[j].ticketCount;
              }
            }
          }
        }
        if (this.regionTempReport) {
          this.reportsOneTheater.totalAmount += this.regionTempReport.amount;
          this.reportsOneTheater.totlaTicketCount += this.regionTempReport.ticketCount;
          this.reportsOneTheater.regionReport.push(this.regionTempReport);
        }
      }
    }
    this.firstCharts();
  }
  //***** First Charts *****/
  firstCharts() {
    this.singleMovieChCommon();
    this.singleMovieChTheater();
  }
  singleMovieChCommon() {
    if (this.singleMovieChMovieId) {
      this.singleMovieChCommonData = [];
      this.singleMovieChCommonColors = new Color();
      this.singleMovieChCommonColors.domain = [];
      this.singleMovieChCommonColors.domain.push(...this.tempColors);
      switch (this.singleMovieChMode) {
        case 0: {
          for (let i = 0; i < this.regionReports.regionReport.length; i++) {
            this.singleMovieChCommonData.push({
              name: this.regionReports.regionReport[i].name,
              value: this.regionReports.regionReport[i].ticketCount
            });
          }
          this.singleMovieChLabelY = 'Всего билетов';
          break;
        }
        case 2: {
          for (let i = 0; i < this.regionReports.regionReport.length; i++) {
            this.singleMovieChCommonData.push({
              name: this.regionReports.regionReport[i].name,
              value: this.regionReports.regionReport[i].amount
            });
          }
          this.singleMovieChLabelY = 'Общая сумма';
          break;
        }
      }
    }
    this.singleMovieChTheater();
  }
  singleMovieChTheater() {
    if (this.singleMovieChMovieId && this.reportsOneTheater) {
      this.singleMovieChTheaterData = [];
      this.singleMovieChTheaterColors = new Color();
      this.singleMovieChTheaterColors.domain = [];
      this.singleMovieChTheaterColors.domain.push(...this.tempColors);
      switch (this.singleMovieChMode) {
        case 0: {
          this.singleMovieChLabelY = 'Всего билетов';
          for (let i = 0; i < this.reportsOneTheater.regionReport.length; i++) {
            this.singleMovieChTheaterData.push({
              name: this.reportsOneTheater.regionReport[i].name,
              value: this.reportsOneTheater.regionReport[i].ticketCount
            });
          }
          break;
        }
        case 2: {
          this.singleMovieChLabelY = 'Общая сумма';
          for (let i = 0; i < this.reportsOneTheater.regionReport.length; i++) {
            this.singleMovieChTheaterData.push({
              name: this.reportsOneTheater.regionReport[i].name,
              value: this.reportsOneTheater.regionReport[i].amount
            });
          }
          break;
        }
      }
    }
  }


  dateRU(data: any) {
    let now = moment(data);
    let month = '';
    let res = now.format('MMMM DD YYYY, h:mm:ss').split(" ");

    switch (res[0]) {
      case "January": {
        month = "Январь";
        break;
      }
      case "February": {
        month = "Февраль";
        break;
      }
      case "March": {
        month = "Март";
        break;
      }
      case "April": {
        month = "Апрель";
        break;
      }
      case "May": {
        month = "Май";
        break;
      }
      case "June": {
        month = "Июнь";
        break;
      }
      case "July": {
        month = "Июль";
        break;
      }
      case "August": {
        month = "Август";
        break;
      }
      case "September": {
        month = "Сентябрь";
        break;
      }
      case "October": {
        month = "Октябрь";
        break;
      }
      case "November": {
        month = "Ноябрь";
        break;
      }
      case "December": {
        month = "Декабрь";
        break;
      }
    }

    let day = res[1];
    let year = res[2].substring(0, 4) + "г.";
    return day + " " + month + " " + year;
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.moviesTable.length, page);
    this.pagedItems = this.moviesTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

class Series {
  name: string;
  value: number;
}

class Color {
  domain: string[];
}

class MovieTableRow {
  _id: string;
  name: string;
  sessionCount: number;
  ticketCount: number;
  price: number;
  overall: number;
}
class TotalReport {
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  summ: number;
  summTotal: number;
}
class MultiChartData {
  name: string;
  series: Series[];
}

class TheaterReport {
  name: string;
  ticketCount: number;
  amount: number;
}
class Year {
  value: number;
  name: string;
}
class TotalRegionReport {
  regionReport: RegionReport[];
  totalAmount: number;
  totlaTicketCount: number;
}
class RegionReport {
  name: string;
  ticketCount: number;
  amount: number;
}
