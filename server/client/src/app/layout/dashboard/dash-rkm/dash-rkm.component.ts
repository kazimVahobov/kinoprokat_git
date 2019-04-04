import {Component, OnInit} from '@angular/core';
import {
  TheaterModel,
  TheaterService,
  DistributorReportService,
  DistributorReportModel,
  TheaterReportService,
  TheaterReportModel,
  MovieService,
  MovieModel,
  ContractService,
  ContractModel,
  PagerService,
  RegionService,
  RegionModel,
  YearListService,
  DistributorModel,
  DistributorService
} from 'src/app/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dash-rkm',
  templateUrl: './dash-rkm.component.html',
  styleUrls: ['./dash-rkm.component.scss']
})
export class DashRkmComponent implements OnInit {
  reportStatus = 1;  // if 0 - no report/ 1 - saved/ 2 - sent/ 3 - confirmed
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
  selectedYearRegion: number;
  //
  theaters: TheaterModel[];
  theaterOfRegion: TheaterModel[];
  currentDist: DistributorModel;
  movies: MovieModel[];
  totalDistReport: DistributorReportModel[];
  regionTempReport: RegionReport;
  regionReports: TotalRegionReport;
  regionReportForTheater: TotalRegionReport;
  totalReport: TotalReport;
  regions: RegionModel[];
  allTheaterReports: TheaterReportModel[];
  totalTheaterReport: TheaterReportModel[];
  theaterReportsOfMovie: TheaterReportModel[];

  comparisonTheaterAmount: number;
  comparisonTheaterTicketCount: number;

  comparisonRegionAmount: number;
  comparisonRegionTicketCount: number;

  // singleMovieChart
  singleMovieChIsOpen = true;
  singleMovieChMode = 0;
  singleMovieChMovieId: string;
  singleMovieChRegionId: string;
  singleMovieChCommonData: Series[] = [];
  singleMovieChTheaterData: Series[] = [];
  singleMovieChCommonColors: Color;
  singleMovieChTheaterColors: Color;
  singleMovieChLabelY = 'Всего билетов';
  // severalTheatersChart
  severalTheatersChIsOpen = true;
  severalRegionsChIsOpen = true;
  severalTheatersChMode = 0;
  severalRegionsChMode = 0;
  severalTheatersChColor: Color;
  severalRegionsChColor: Color;
  severalTheatersChSelectedTheaters: string[] = [];
  severalRegionsChSelectedRegions: string[] = [];
  severalTheaterChData: MultiChartData[] = [];
  severalRegionChData: MultiChartData[] = [];
  severalTheatersChLabelY = '';
  severalRegionsChLabelY = '';

  // table of theaters
  tableMoviesIsOpen = true;
  pager: any = {};
  pagedItems: any[];

  moviesTable: MovieTableRow[] = [];
  movieTable: MovieTableRow;

  yearList: Year[];

  constructor(private theaterService: TheaterService,
              private distReportService: DistributorReportService,
              private theaterReportService: TheaterReportService,
              private regionService: RegionService,
              private movieService: MovieService,
              private contractService: ContractService,
              private pagerService: PagerService,
              private distributorService: DistributorService,
              private yearListService: YearListService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.theaters = [];
    this.totalDistReport = [];
    this.movies = [];
    this.totalTheaterReport = [];
    this.regions = [];
    this.allTheaterReports = [];
    this.theaterReportsOfMovie = [];
    this.theaterOfRegion = [];
    this.currentDist = new DistributorModel();

    this.yearListService.getYearList();
    this.yearList = JSON.parse(localStorage.getItem('yearList'));
    this.yearList = this.yearList.reverse();
    localStorage.removeItem('yearList');

    this.distReportService.getAll().subscribe(distReports => {
      this.theaterService.getAll().subscribe(theaters => {
        this.theaterReportService.getAll().subscribe(theaterReports => {
          this.movieService.getAll().subscribe(movies => {
            this.regionService.getAll().subscribe(regions => {
              this.distributorService.getById(this.currentUser.distId).subscribe(distributor => {

                this.currentDist = distributor;

                this.regions = regions;
                this.singleMovieChRegionId = regions[0]._id;
                this.theaters = theaters;
                this.movies = movies;
                this.singleMovieChMovieId = this.movies[0]._id;

                this.selectedYearRegion = this.yearList[0].value
                this.selectedYearTheater = this.yearList[0].value

                this.totalTheaterReport = theaterReports.filter(r => new Date(r.date).toDateString() === this.currentDate.toDateString() &&
                  r.sent === true)
                this.totalDistReport = distReports.filter(r => new Date(r.date).toDateString() === this.currentDate.toDateString() &&
                  r.sent === true)
                this.allTheaterReports = theaterReports;

                if (this.totalTheaterReport.length || this.totalDistReport.length) {
                  this.reportStatus = 1;
                } else {
                  this.reportStatus = 0
                }

                //TotalReport
                this.totalReport = new TotalReport();
                this.totalReport.movies = [];
                this.totalReport.sessionCount = 0;
                this.totalReport.summ = 0;
                this.totalReport.ticketCount = 0;
                this.totalReport.theaterReportCount = 0;
                this.totalReport.mobileReportCount = 0;

                if (this.totalDistReport) {
                  for (let i = 0; i < this.totalDistReport.length; i++) {
                    for (let j = 0; j < this.totalDistReport[i].theaterReports.length; j++) {
                      for (let m = 0; m < theaterReports.length; m++) {
                        if (this.totalDistReport[i].theaterReports[j].theaterReportsId === theaterReports[m]._id) {
                          this.totalTheaterReport.push(theaterReports[m])
                        }
                      }
                    }
                    for (let a = 0; a < this.totalDistReport[i].mobileTheaters.length; a++) {
                      this.totalReport.mobileReportCount += 1;
                      this.totalReport.summTotal += this.totalDistReport[i].mobileTheaters[a].price * this.totalDistReport[i].mobileTheaters[a].ticketCount;
                      this.totalReport.sessionCount += this.totalDistReport[i].mobileTheaters[a].sessionCount;
                      this.totalReport.ticketCount += this.totalDistReport[i].mobileTheaters[a].ticketCount;
                      if (!this.totalReport.movies.some(m => m === this.totalDistReport[i].mobileTheaters[a].movieId)) {
                        this.totalReport.movies.push(this.totalDistReport[i].mobileTheaters[a].movieId);
                      }
                    }

                  }

                  for (let i = 0; i < this.totalTheaterReport.length; i++) {

                    this.totalReport.summ = 0;
                    this.totalReport.theaterReportCount += 1;

                    for (let j = 0; j < this.totalTheaterReport[i].withCont.length; j++) {
                      this.totalReport.sessionCount += 1;
                      this.totalReport.ticketCount += this.totalTheaterReport[i].withCont[j].ticketCount;
                      this.totalReport.summ += this.totalTheaterReport[i].withCont[j].ticketCount * this.totalTheaterReport[i].withCont[j].price;
                      this.totalReport.movies.push(this.totalTheaterReport[i].withCont[j].movieId);
                    }

                    this.totalReport.summTotal += this.totalReport.summ;
                  }
                }

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

                this.changeMovie();
                this.setPage(1);
              });
            });
          });
        });
      });
    });
  }

  changeMovie() {

    this.theaterReportsOfMovie = this.allTheaterReports.filter(r =>
      r.withCont.some(w => w.movieId === this.singleMovieChMovieId)
      && r.sent === true && r.confirm === true)
    this.regionReports = new TotalRegionReport();
    this.regionReports.regionReport = [];
    this.regionReports.totalAmount = 0;
    this.regionReports.totalTicketCount = 0;

    for (let a = 0; a < this.regions.length; a++) {

      this.theaterOfRegion = this.theaters.filter(th => th.regionId === this.regions[a]._id);
      this.regionTempReport = new RegionReport();
      this.regionTempReport.amount = 0;
      this.regionTempReport.ticketCount = 0;
      this.regionTempReport.name = this.regions[a].name;
      for (let i = 0; i < this.theaterReportsOfMovie.length; i++) {
        for (let j = 0; j < this.theaterReportsOfMovie[i].withCont.length; j++) {
          if (this.theaterReportsOfMovie[i].withCont[j].movieId === this.singleMovieChMovieId
            && this.theaterOfRegion.some(th => th._id === this.theaterReportsOfMovie[i].theaterId)) {
            this.regionTempReport.amount += this.theaterReportsOfMovie[i].withCont[j].price * this.theaterReportsOfMovie[i].withCont[j].ticketCount;
            this.regionTempReport.ticketCount += this.theaterReportsOfMovie[i].withCont[j].ticketCount;
          }
        }
      }

      if (this.regionTempReport) {
        this.regionReports.totalAmount += this.regionTempReport.amount;
        this.regionReports.totalTicketCount += this.regionTempReport.ticketCount;
        this.regionReports.regionReport.push(this.regionTempReport);
      }

    }
    this.singleMovieChMode = 0;
    this.changeRegion();
  }

  changeRegion() {
    var theaterOneRegion = this.theaters.filter(th => th.regionId === this.singleMovieChRegionId);
    if (theaterOneRegion) {
      this.regionReportForTheater = new TotalRegionReport();
      this.regionReportForTheater.regionReport = [];
      this.regionReportForTheater.totalAmount = 0;
      this.regionReportForTheater.totalTicketCount = 0;
      for (let a = 0; a < theaterOneRegion.length; a++) {
        var theaterReporsOneTheater = this.allTheaterReports.filter(r => r.theaterId === theaterOneRegion[a]._id)
        this.regionTempReport = new RegionReport();
        this.regionTempReport.amount = 0;
        this.regionTempReport.ticketCount = 0;
        this.regionTempReport.name = theaterOneRegion[a].name
        if (theaterReporsOneTheater) {
          for (let i = 0; i < theaterReporsOneTheater.length; i++) {
            for (let j = 0; j < theaterReporsOneTheater[i].withCont.length; j++) {
              if (theaterReporsOneTheater[i].withCont[j].movieId === this.singleMovieChMovieId) {
                this.regionTempReport.amount += theaterReporsOneTheater[i].withCont[j].price * theaterReporsOneTheater[i].withCont[j].ticketCount;
                this.regionTempReport.ticketCount += theaterReporsOneTheater[i].withCont[j].ticketCount;
              }
            }
          }
        }
        if (this.regionTempReport) {
          this.regionReportForTheater.totalAmount += this.regionTempReport.amount;
          this.regionReportForTheater.totalTicketCount += this.regionTempReport.ticketCount;
          this.regionReportForTheater.regionReport.push(this.regionTempReport);
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
    if (this.singleMovieChMovieId && this.regionReportForTheater) {
      this.singleMovieChTheaterData = [];
      this.singleMovieChTheaterColors = new Color();
      this.singleMovieChTheaterColors.domain = [];
      this.singleMovieChTheaterColors.domain.push(...this.tempColors);
      switch (this.singleMovieChMode) {
        case 0: {
          this.singleMovieChLabelY = 'Всего билетов';
          for (let i = 0; i < this.regionReportForTheater.regionReport.length; i++) {
            this.singleMovieChTheaterData.push({
              name: this.regionReportForTheater.regionReport[i].name,
              value: this.regionReportForTheater.regionReport[i].ticketCount
            });
          }
          break;
        }
        case 2: {
          this.singleMovieChLabelY = 'Общая сумма';
          for (let i = 0; i < this.regionReportForTheater.regionReport.length; i++) {
            this.singleMovieChTheaterData.push({
              name: this.regionReportForTheater.regionReport[i].name,
              value: this.regionReportForTheater.regionReport[i].amount
            });
          }
          break;
        }
      }
    }
  }

  //***** Second Charts *****/
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
            var theaterReporsOneTheater = this.allTheaterReports.filter(r =>
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

  //***** Third Charts *****/
  severalRegionCh() {
    if (this.severalRegionsChSelectedRegions.length !== 0 && this.selectedYearRegion) {

      this.comparisonRegionAmount = 0;
      this.comparisonRegionTicketCount = 0;

      this.severalRegionsChColor = new Color();
      this.severalRegionsChColor.domain = [];
      this.severalRegionsChColor.domain.push(...this.tempColors);
      this.severalRegionChData = [];


      this.severalRegionsChSelectedRegions.forEach(region => {

        var theaters = this.theaters.filter(th => th.regionId === region)
        let series: Series[] = [];

        this.months.forEach(month => {
          if (month.value != 12) {

            var theaterReporsOneTheater = this.allTheaterReports.filter(r =>
              theaters.some(th => th._id === r.theaterId) && new Date(r.date).getMonth() === month.value &&
              new Date(r.date).getFullYear() === this.selectedYearRegion);

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
            this.comparisonRegionAmount += this.regionTempReport.amount
            this.comparisonRegionTicketCount += this.regionTempReport.ticketCount
            if (this.severalRegionsChMode === 0) {
              this.severalRegionsChLabelY = 'Кол-во билетов';
              series.push({
                name: month.name,
                value: this.regionTempReport.ticketCount
              });
            } else if (this.severalRegionsChMode === 2) {
              this.severalRegionsChLabelY = 'Общая сумма';
              series.push({
                name: month.name,
                value: this.regionTempReport.amount
              });
            }

          }
        });
        this.severalRegionChData.push({
          name: this.regions.find(th => th._id === region).name,
          series: series
        });
      });
    }
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.moviesTable.length, page);
    this.pagedItems = this.moviesTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
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
}

class TotalRegionReport {
  regionReport: RegionReport[];
  totalAmount: number;
  totalTicketCount: number;
}

class RegionReport {
  name: string;
  ticketCount: number;
  amount: number;
}

class Series {
  name: string;
  value: number;
}

class Color {
  domain: string[];
}

class TotalReport {
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  summ: number;
  summTotal: number;
  theaterReportCount: number;
  mobileReportCount: number;
}

class MultiChartData {
  name: string;
  series: Series[];
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
