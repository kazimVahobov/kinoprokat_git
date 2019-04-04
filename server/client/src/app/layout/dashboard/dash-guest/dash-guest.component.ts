import {Component, OnInit} from '@angular/core';
import {
  MovieService,
  TheaterReportService,
  TheaterReportModel,
  MovieModel,
  PagerService,
  TheaterService,
  TheaterModel,
  RegionModel,
  RegionService,
  YearListService
} from 'src/app/core';
import * as moment from 'moment';


@Component({
  selector: 'app-dash-guest',
  templateUrl: './dash-guest.component.html',
  styleUrls: ['./dash-guest.component.scss']
})
export class DashGuestComponent implements OnInit {

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

  theaterReports: TheaterReportModel[];
  theaterReporsOfMovie: TheaterReportModel[];
  movies: MovieModel[];
  currentMovie: MovieModel;
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

  reports: Report[];
  tempReport: Report;

  currentUser = JSON.parse(localStorage.getItem('user'));
  currentRole = JSON.parse(localStorage.getItem('role'));
  currentDate = new Date();
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  totalTicketCount: number;
  totalAmount: number;

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

  regionReportForTheater: TotalRegionReport;
  alltheaterReports: TheaterReportModel[];
  theaters: TheaterModel[];
  regionTempReport: RegionReport;
  regionReports: TotalRegionReport;
  regions: RegionModel[];
  theaterOfRegion: TheaterModel[];

  //guest variable
  selectedYearTheater: number;
  selectedYearRegion: number;
  movieTable: MovieTableRow;
  yearList: Year[];
  moviesTable: MovieTableRow[] = [];
  // severalTheatersChart
  severalTheatersChIsOpen = true;
  severalRegionsChIsOpen = true;
  severalTheatersChMode = 0;
  severalRegionsChMode = 0;
  severalTheatersChColor: Color;
  severalRegionsChColor: Color;
  severalTheatersChSelectedTheaters: string[] = [];
  severalRegoinsChSelectedRegions: string[] = [];
  severalTheaterChData: MultiChartData[] = [];
  severalReagionChData: MultiChartData[] = [];
  severalTheatersChLabelY = '';
  severalRegionsChLabelY = '';

  comparisonTheaterAmount: number;
  comparisonTheaterTicketCount: number;

  comparisonRegionAmount: number;
  comparisonRegionTicketCount: number;

  tableBlockIsOpen: boolean = true;

  constructor(private movieService: MovieService,
              private theaterReportService: TheaterReportService,
              private pagerService: PagerService,
              private theaterService: TheaterService,
              private regionService: RegionService,
              private yearListService: YearListService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.theaterReports = [];
    this.theaterReporsOfMovie = [];
    this.reports = [];
    this.movies = [];
    this.currentMovie = new MovieModel();
    this.totalAmount = 0;
    this.totalTicketCount = 0;
    this.alltheaterReports = [];
    this.theaterReporsOfMovie = [];
    this.theaterOfRegion = [];
    this.comparisonTheaterAmount = 0;
    this.comparisonTheaterTicketCount = 0;

    this.yearListService.getYearList();
    this.yearList = JSON.parse(localStorage.getItem('yearList'));
    this.yearList = this.yearList.reverse();
    localStorage.removeItem('yearList');

    this.theaterReportService.getAll().subscribe(theaterReports => {
      this.movieService.getAll().subscribe(movies => {
        this.theaterService.getAll().subscribe(theaters => {
          this.regionService.getAll().subscribe(regions => {

            this.regions = regions;
            this.singleMovieChRegionId = regions[0]._id
            this.theaters = theaters;
            this.alltheaterReports = theaterReports;

            //gost
            if (this.currentRole.typeOfRole === 3) {
              this.regions = regions;
              this.singleMovieChRegionId = regions[0]._id
              this.theaters = theaters;
              this.movies = movies;
              this.singleMovieChMovieId = this.movies[0]._id;

              this.selectedYearRegion = this.yearList[0].value
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
              this.setPage(1);
              this.changeMovieGuest();
            } else {

              //copyright holder of the film
              if (this.currentUser.movieId) {

                this.currentMovie = movies.find(m => m._id === this.currentUser.movieId)
                this.singleMovieChMovieId = this.currentMovie._id
                this.theaterReporsOfMovie = theaterReports.filter(r =>
                  r.withCont.some(w => w.movieId === this.currentMovie._id)
                  && r.sent === true && r.confirm === true)

                for (let i = 0; i < this.theaterReporsOfMovie.length; i++) {
                  this.tempReport = new Report();
                  this.tempReport.ticketCount = 0;
                  this.tempReport.amount = 0;
                  this.tempReport._id = this.theaterReporsOfMovie[i]._id;
                  this.tempReport.date = this.theaterReporsOfMovie[i].date;
                  this.tempReport.sent = this.theaterReporsOfMovie[i].sent;
                  this.tempReport.confirm = this.theaterReporsOfMovie[i].confirm;
                  this.tempReport.sessionCount = this.theaterReporsOfMovie[i].withCont.length;

                  for (let j = 0; j < this.theaterReporsOfMovie[i].withCont.length; j++) {
                    if (this.theaterReporsOfMovie[i].withCont[j].movieId === this.currentMovie._id) {
                      this.tempReport.ticketCount += this.theaterReporsOfMovie[i].withCont[j].ticketCount;
                      this.tempReport.amount += this.theaterReporsOfMovie[i].withCont[j].ticketCount * this.theaterReporsOfMovie[i].withCont[j].price;
                    }
                  }
                  this.associationDateReport(this.reports, this.tempReport)
                  this.totalAmount += this.tempReport.amount
                  this.totalTicketCount += this.tempReport.ticketCount
                }
                this.reports = this.reports.reverse();
                this.setPage(1);
              }
              this.changeMovie();
            }
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

    for (let a = 0; a < this.regions.length; a++) {

      this.theaterOfRegion = this.theaters.filter(th => th.regionId === this.regions[a]._id);
      this.regionTempReport = new RegionReport();
      this.regionTempReport.amount = 0;
      this.regionTempReport.ticketCount = 0;
      this.regionTempReport.name = this.regions[a].name;
      for (let i = 0; i < this.theaterReporsOfMovie.length; i++) {
        for (let j = 0; j < this.theaterReporsOfMovie[i].withCont.length; j++) {
          if (this.theaterReporsOfMovie[i].withCont[j].movieId === this.singleMovieChMovieId
            && this.theaterOfRegion.some(th => th._id === this.theaterReporsOfMovie[i].theaterId)) {
            this.regionTempReport.amount += this.theaterReporsOfMovie[i].withCont[j].price * this.theaterReporsOfMovie[i].withCont[j].ticketCount;
            this.regionTempReport.ticketCount += this.theaterReporsOfMovie[i].withCont[j].ticketCount;
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
    var theaterOneRegion = this.theaters.filter(th => th.regionId === this.singleMovieChRegionId);
    if (theaterOneRegion) {
      this.regionReportForTheater = new TotalRegionReport();
      this.regionReportForTheater.regionReport = [];
      this.regionReportForTheater.totalAmount = 0;
      this.regionReportForTheater.totlaTicketCount = 0;
      for (let a = 0; a < theaterOneRegion.length; a++) {
        var theaterReporsOneTheater = this.alltheaterReports.filter(r => r.theaterId === theaterOneRegion[a]._id)
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
          this.regionReportForTheater.totlaTicketCount += this.regionTempReport.ticketCount;
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

  associationDateReport(reports: any[], report: any) {
    if (reports.length) {
      for (let i = 0; i < reports.length; i++) {
        if (new Date(reports[i].date).toDateString() === new Date(report.date).toDateString()) {
          reports[i].amount += report.amount;
          reports[i].ticketCount += report.ticketCount;
        }
      }
      if (!reports.some(r => new Date(r.date).toDateString() === new Date(report.date).toDateString())) {
        reports.push(report)
      }

    } else {
      reports.push(report)
    }
  }

  //Guest Charts

  changeMovieGuest() {

    this.theaterReporsOfMovie = this.alltheaterReports.filter(r =>
      r.withCont.some(w => w.movieId === this.singleMovieChMovieId)
      && r.sent === true && r.confirm === true)
    this.regionReports = new TotalRegionReport();
    this.regionReports.regionReport = [];
    this.regionReports.totalAmount = 0;
    this.regionReports.totlaTicketCount = 0;

    for (let a = 0; a < this.regions.length; a++) {

      this.theaterOfRegion = this.theaters.filter(th => th.regionId === this.regions[a]._id);
      this.regionTempReport = new RegionReport();
      this.regionTempReport.amount = 0;
      this.regionTempReport.ticketCount = 0;
      this.regionTempReport.name = this.regions[a].name;
      for (let i = 0; i < this.theaterReporsOfMovie.length; i++) {
        for (let j = 0; j < this.theaterReporsOfMovie[i].withCont.length; j++) {
          if (this.theaterReporsOfMovie[i].withCont[j].movieId === this.singleMovieChMovieId
            && this.theaterOfRegion.some(th => th._id === this.theaterReporsOfMovie[i].theaterId)) {
            this.regionTempReport.amount += this.theaterReporsOfMovie[i].withCont[j].price * this.theaterReporsOfMovie[i].withCont[j].ticketCount;
            this.regionTempReport.ticketCount += this.theaterReporsOfMovie[i].withCont[j].ticketCount;
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
    this.changeRegionGuest();
  }

  changeRegionGuest() {
    var theaterOneRegion = this.theaters.filter(th => th.regionId === this.singleMovieChRegionId);
    if (theaterOneRegion) {
      this.regionReportForTheater = new TotalRegionReport();
      this.regionReportForTheater.regionReport = [];
      this.regionReportForTheater.totalAmount = 0;
      this.regionReportForTheater.totlaTicketCount = 0;
      for (let a = 0; a < theaterOneRegion.length; a++) {
        var theaterReporsOneTheater = this.alltheaterReports.filter(r => r.theaterId === theaterOneRegion[a]._id)
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
          this.regionReportForTheater.totlaTicketCount += this.regionTempReport.ticketCount;
          this.regionReportForTheater.regionReport.push(this.regionTempReport);
        }
      }
    }
    this.firstChartsGuest();
  }

  //***** First Charts *****/
  firstChartsGuest() {
    this.singleMovieChCommonGuest();
    this.singleMovieChTheaterGuest();
  }

  singleMovieChCommonGuest() {
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

  singleMovieChTheaterGuest() {
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

  //***** Second Charts *****/
  severalRegionCh() {
    if (this.severalRegoinsChSelectedRegions.length !== 0 && this.selectedYearRegion) {

      this.comparisonRegionAmount = 0;
      this.comparisonRegionTicketCount = 0;

      this.severalRegionsChColor = new Color();
      this.severalRegionsChColor.domain = [];
      this.severalRegionsChColor.domain.push(...this.tempColors);
      this.severalReagionChData = [];


      this.severalRegoinsChSelectedRegions.forEach(region => {

        var theaters = this.theaters.filter(th => th.regionId === region)
        let series: Series[] = [];

        this.months.forEach(month => {
          if (month.value != 12) {

            var theaterReporsOneTheater = this.alltheaterReports.filter(r =>
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
        this.severalReagionChData.push({
          name: this.regions.find(th => th._id === region).name,
          series: series
        });
      });
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
    if (this.currentRole.typeOfRole === 3) {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.moviesTable.length, page);
      // get current page of items
      this.pagedItems = this.moviesTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      // get pager object from service
      this.reports.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        let result = 0;
        if (aDate > bDate) {
          result = -1;
        }
        if (aDate < bDate) {
          result = 1;
        }
        return result;
      });
      this.pager = this.pagerService.getPager(this.reports.length, page);
      // get current page of items
      this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

}

class Report {
  _id: string;
  date: Date;
  sessionCount: number;
  ticketCount: number;
  amount: number;
  sent: boolean;
  confirm: boolean;
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

class Year {
  value: number;
  name: string;
}

class MultiChartData {
  name: string;
  series: Series[];
}
