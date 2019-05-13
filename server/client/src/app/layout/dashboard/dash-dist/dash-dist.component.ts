import { Component, OnInit } from '@angular/core';
import {
  TheaterModel,
  TheaterService,
  DistributorReportService,
  DistributorReportModel,
  TheaterReportService,
  TheaterReportModel,
  MovieService,
  ContractService,
  ContractModel,
  DistributorModel,
  DistributorService,
  PagerService,
  YearListService,
  MovieModel
} from 'src/app/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dash-dist',
  templateUrl: './dash-dist.component.html',
  styleUrls: ['./dash-dist.component.scss']
})
export class DashDistComponent implements OnInit {
  reportStatus = 0;  // if 0 - no report/ 1 - saved/ 2 - sent/ 3 - confirmed
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
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
  // severalTheatersChart
  severalTheatersChIsOpen = true;
  severalTheatersChMode = 0;
  severalTheatersChColor: Color;
  severalTheatersChSelectedTheaters: string[] = [];
  severalTheaterChData: MultiChartData[] = [];
  severalTheatersChLabelY = '';
  severalTheatersChTicket: number = 0;
  severalTheatersChPrice: number = 0;
  severalTheatersChOverall: number = 0;


  comparisonTheaterAmount: number;
  comparisonTheaterTicketCount: number;

  regionTempReport: RegionReport;

  // table of theaters
  tableMoviesIsOpen = true;
  theaters: TheaterModel[];
  movies: MovieModel[];
  contracts: ContractModel[];
  theaterReportsWithDist: TheaterReportModel[];
  theaterReporsOfMovie: TheaterReportModel[];
  alltheaterReports: TheaterReportModel[];
  pager: any = {};
  pagedItems: any[];

  currentReport: DistributorReportModel;
  distReports: DistributorReportModel[];
  currentDist: DistributorModel;
  chartMode = 1;
  chartMode2 = 1;
  chartMode3 = 1;

  theaterReport: TotalReport;

  totalReport: TotalReport;

  colorScheme: any;
  colorScheme2: any;
  colorScheme3: any;

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

  reportsOneTheater: TotalRegionReport;
  regionReports: TotalRegionReport;
  theaterOfRegion: TheaterModel[];

  constructor(private theaterService: TheaterService,
    private distReportService: DistributorReportService,
    private theaterReportService: TheaterReportService,
    private movieService: MovieService,
    private contractService: ContractService,
    private distributorService: DistributorService,
    private pagerService: PagerService,
    private yearListService: YearListService) { }

  ngOnInit() {
    this.theaters = [];
    this.theaterReportsWithDist = [];
    this.movies = [];
    this.contracts = [];
    this.theaterReporsOfMovie = [];
    this.alltheaterReports = [];
    this.currentDist = new DistributorModel();
    this.currentReport = new DistributorReportModel();

    this.loadDashboard();
  }

  loadDashboard() {

    this.yearList = [];
    this.yearListService.getYearList();
    this.yearList = JSON.parse(localStorage.getItem('yearList'));
    this.yearList = this.yearList.reverse();
    localStorage.removeItem('yearList');

    this.distReportService.getAll().subscribe(distReports => {
      this.theaterService.getAll().subscribe(theaters => {
        this.theaterReportService.getAll().subscribe(theaterReports => {
          this.movieService.getAll().subscribe(movies => {
            this.contractService.getAll().subscribe(contracts => {
              this.distributorService.getById(this.currentUser.distId).subscribe(distributor => {

                this.singleMovieChMovieId = movies[0]._id
                this.movies = movies;
                this.currentDist = distributor;
                this.theaters = theaters.filter(th => th.distId === this.currentUser.distId);
                this.singleMovieChTheaterId = this.theaters[0]._id
                this.contracts = contracts.filter(c => c.typeOfCont === 2)
                this.distReports = distReports.filter(r => r.distId === this.currentUser.distId);
                this.currentReport = distReports.find(r =>
                  new Date(r.date).toDateString() === this.currentDate.toDateString()
                  && r.distId === this.currentUser.distId);
                this.alltheaterReports = theaterReports;
                this.selectedYearTheater = this.yearList[0].value

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
                this.currentDistData(theaterReports)
                this.setPage(1);
                this.changeMovie();
              });
            });
          });
        });
      });
    });
  }

  changeMovie() {
    this.regionReports = new TotalRegionReport();
    this.regionReports.regionReport = [];
    this.regionReports.totalAmount = 0;
    this.regionReports.totlaTicketCount = 0;

    for (let a = 0; a < this.theaters.length; a++) {

      this.theaterReporsOfMovie = this.alltheaterReports.filter(r => r.theaterId === this.theaters[a]._id)
      this.regionTempReport = new RegionReport();
      this.regionTempReport.amount = 0;
      this.regionTempReport.ticketCount = 0;
      this.regionTempReport.name = this.theaters[a].name;
      for (let i = 0; i < this.theaterReporsOfMovie.length; i++) {
        for (let j = 0; j < this.theaterReporsOfMovie[i].withCont.length; j++) {
          if (this.theaterReporsOfMovie[i].withCont[j].movieId === this.singleMovieChMovieId) {
            this.regionTempReport.amount += this.theaterReporsOfMovie[i].withCont[j].price * this.theaterReporsOfMovie[i].withCont[j].ticketCount;
            this.regionTempReport.ticketCount += this.theaterReporsOfMovie[i].withCont[j].ticketCount;
          }
        }
      }
      this.theaterReporsOfMovie = [];

      if (this.regionTempReport) {
        this.regionReports.totalAmount += this.regionTempReport.amount;
        this.regionReports.totlaTicketCount += this.regionTempReport.ticketCount;
        this.regionReports.regionReport.push(this.regionTempReport);
      }

    }
    this.singleMovieChMode = 0;
    this.changeTheater();
  }

  changeTheater() {
    var selectedTheater = this.theaters.find(th => th._id === this.singleMovieChTheaterId);
    if (selectedTheater) {
      this.reportsOneTheater = new TotalRegionReport();
      this.reportsOneTheater.regionReport = [];
      this.reportsOneTheater.totalAmount = 0;
      this.reportsOneTheater.totlaTicketCount = 0;
      var theaterReporsOneTheater = this.alltheaterReports.filter(r =>
        r.theaterId === selectedTheater._id && r.sent === true && r.confirm === true)
      for (let a = 0; a < selectedTheater.holes.length; a++) {
        this.regionTempReport = new RegionReport();
        this.regionTempReport.amount = 0;
        this.regionTempReport.ticketCount = 0;
        this.regionTempReport.name = selectedTheater.holes[a].name
        if (theaterReporsOneTheater) {
          for (let i = 0; i < theaterReporsOneTheater.length; i++) {
            for (let j = 0; j < theaterReporsOneTheater[i].withCont.length; j++) {
              if (theaterReporsOneTheater[i].withCont[j].movieId === this.singleMovieChMovieId &&
                theaterReporsOneTheater[i].withCont[j].holeId === selectedTheater.holes[a]._id) {
                this.regionTempReport.amount += theaterReporsOneTheater[i].withCont[j].price * theaterReporsOneTheater[i].withCont[j].ticketCount;
                this.regionTempReport.ticketCount += theaterReporsOneTheater[i].withCont[j].ticketCount;
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
  currentDistData(theaterReports: TheaterReportModel[]) {
    // ------------Current Report Start------------//

    // if (this.currentReport) {
    //
    //   this.theaterReportsWithDist = theaterReports.filter(r => this.currentReport.theaterReports.some(d => d.theaterReportsId === r._id));
    //
    //   if (this.currentReport.sent) {
    //     this.reportStatus = 2;
    //     if (this.currentReport.confirm) {
    //       this.reportStatus = 3;
    //     }
    //   } else {
    //     this.reportStatus = 1;
    //   }
    // } else {
    //   this.reportStatus = 0
    // }

    this.theaterReport = new TotalReport();
    this.theaterReport.movies = [];
    this.theaterReport.sessionCount = 0;
    this.theaterReport.summ = 0;
    this.theaterReport.summTotal = 0;
    this.theaterReport.ticketCount = 0;

    //Theater Reports
    if (this.theaterReportsWithDist) {
      for (let i = 0; i < this.theaterReportsWithDist.length; i++) {
        this.theaterReport.summ = 0;
        for (let j = 0; j < this.theaterReportsWithDist[i].withCont.length; j++) {
          this.theaterReport.sessionCount += 1;
          this.theaterReport.ticketCount += this.theaterReportsWithDist[i].withCont[j].ticketCount;
          this.theaterReport.summ += this.theaterReportsWithDist[i].withCont[j].ticketCount * this.theaterReportsWithDist[i].withCont[j].price;
          this.theaterReport.movies.push(this.theaterReportsWithDist[i].withCont[j].movieId);
        }
        this.theaterReport.summTotal += this.theaterReport.summ;
      }
    }
    // //Mobile Reports
    // if (this.currentReport && this.currentReport.mobileTheaters) {
    //   for (let i = 0; i < this.currentReport.mobileTheaters.length; i++) {
    //     this.theaterReport.summTotal += this.currentReport.mobileTheaters[i].price * this.currentReport.mobileTheaters[i].ticketCount;
    //     this.theaterReport.sessionCount += this.currentReport.mobileTheaters[i].sessionCount;
    //     this.theaterReport.ticketCount += this.currentReport.mobileTheaters[i].ticketCount;
    //     this.theaterReport.movies.push(this.currentReport.mobileTheaters[i].movieId);
    //   }
    // }
    // ------------Current Report End------------//
  }

  severalTheatersCh() {
    if (this.severalTheatersChSelectedTheaters.length !== 0 && this.selectedYearTheater) {

      this.comparisonTheaterAmount = 0;
      this.comparisonTheaterTicketCount = 0;

      this.severalTheatersChColor = new Color();
      this.severalTheatersChColor.domain = [];
      this.severalTheatersChColor.domain.push(...this.tempColors);
      this.severalTheaterChData = [];

      this.severalTheatersChSelectedTheaters.forEach(theater => {
        let series: Series[] = [];
        this.months.forEach(month => {

          if (month.value != 12) {
            var theaterReporsOneTheater = this.alltheaterReports.filter(r =>
              r.theaterId === theater && new Date(r.date).getMonth() === month.value &&
              new Date(r.date).getFullYear() === this.selectedYearTheater);

            this.regionTempReport = new RegionReport();
            this.regionTempReport.amount = 0;
            this.regionTempReport.ticketCount = 0;

            if (theaterReporsOneTheater) {
              for (let i = 0; i < theaterReporsOneTheater.length; i++) {
                for (let j = 0; j < theaterReporsOneTheater[i].withCont.length; j++) {
                  this.regionTempReport.amount += theaterReporsOneTheater[i].withCont[j].price * theaterReporsOneTheater[i].withCont[j].ticketCount;
                  this.regionTempReport.ticketCount += theaterReporsOneTheater[i].withCont[j].ticketCount;
                }
              }
            }
            this.comparisonTheaterAmount += this.regionTempReport.amount
            this.comparisonTheaterTicketCount += this.regionTempReport.ticketCount
            if (this.severalTheatersChMode === 0) {
              this.severalTheatersChLabelY = 'Кол-во билетов';
              series.push({
                name: month.name,
                value: this.regionTempReport.ticketCount
              });
            } else if (this.severalTheatersChMode === 2) {
              this.severalTheatersChLabelY = 'Общая сумма';
              series.push({
                name: month.name,
                value: this.regionTempReport.amount
              });
            }

          }
        });
        this.severalTheaterChData.push({
          name: this.theaters.find(th => th._id === theater).name,
          series: series
        });
      });
    }
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.moviesTable.length, page);
    this.pagedItems = this.moviesTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
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

class TotalReport {
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  summ: number;
  summTotal: number;
}


class Color {
  domain: string[];
}

class MultiChartData {
  name: string;
  series: Series[];
}

class Series {
  name: string;
  value: number;
}

class MovieTableRow {
  _id: string;
  name: string;
  sessionCount: number;
  ticketCount: number;
  price: number;
  overall: number;
}
class Year {
  value: number;
  name: string;
}
