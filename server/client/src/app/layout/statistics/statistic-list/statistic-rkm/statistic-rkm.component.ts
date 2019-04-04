import { Component, OnInit } from '@angular/core';
import {
  MovieService,
  TheaterReportService,
  RegionService,
  RegionModel,
  TheaterReportModel,
  ContractModel,
  ContractService,
  TheaterService,
  YearListService,
  MovieModel,
  DistributorReportModel,
  DistributorReportService,
  DistributorModel,
  DistributorService
} from 'src/app/core';
import { DatePipe } from "@angular/common";

declare var $;

@Component({
  selector: 'app-statistic-rkm',
  templateUrl: './statistic-rkm.component.html',
  styleUrls: ['./statistic-rkm.component.scss']
})
export class StatisticRkmComponent implements OnInit {

  regions: RegionModel[];
  movies: Movie[];
  theaterReports: TheaterReportModel[];
  distReports: DistributorReportModel[];
  allDistReports: DistributorReportModel[];
  allTheaterReports: TheaterReportModel[];
  notSentTheaterReport: TheaterReportModel[];
  theaters: Theater[];
  contracts: ContractModel[];
  distributors: DistributorModel[];
  allDistributors: DistributorModel[];

  parametersPanelIsOpen: boolean = true;

  currentDate = new Date();

  months = [
    {
      name: 'Все месяцы',
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
      name: 'Июн ',
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
      name: 'Декабрь ',
      value: 11
    },
  ];


  selectedCond: number;

  selectedYear: number;
  selectedMonth: number;
  selectedMovie: string = 'all';
  selectedRegion: string = 'all';
  selectedTheater: string = 'all';


  isTheater = false;
  isMovie = true;
  isOneTheater = false;
  isMonth = false;
  isOneMonth = false;
  byMonth = false;
  //Filter
  filterTheaters: Theater[];
  filterTheatersOfRegion: Theater[];
  filterTheatersOfTheater: Theater[];
  filterTheaterReports: TheaterReportModel[];
  filterMovies: Movie[];
  filterRegions: RegionModel[];
  filterDistReport: DistributorReportModel[];
  //Total
  reportsTotalOne: TotalReport[];
  reportsTotalTwo: TotalReport[];
  reportTotal: TotalReport;
  oneReport: ReportOfTotalReport;
  totalAmount: number;
  totalTicketCount: number;
  yearList: Year[];

  startDateOfReports: string = null;
  endDateOfReports: string = null;
  reportsForPrint: ReportOfTotalReport[];
  moviesForPrint: MovieModel[];

  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private movieService: MovieService,
    private regionService: RegionService,
    private theaterReportService: TheaterReportService,
    private contractService: ContractService,
    private theaterService: TheaterService,
    private yearListService: YearListService,
    private distReportService: DistributorReportService,
    private distService: DistributorService,
    public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.moviesForPrint = [];
    this.reportsForPrint = [];
    this.filterTheaterReports = [];
    this.regions = [];
    this.movies = [];
    this.theaters = [];
    this.theaterReports = [];
    this.notSentTheaterReport = [];
    this.contracts = [];
    this.selectedCond = 0;
    this.distReports = [];
    this.allDistReports = [];
    this.distributors = [];
    this.allDistributors = [];
    //filter:
    this.filterTheaters = [];
    this.filterTheaterReports = [];
    this.filterMovies = [];
    this.filterRegions = [];
    this.filterDistReport = [];
    //Total
    this.reportsTotalOne = [];
    this.reportsTotalTwo = [];
    this.yearList = [];

    this.yearListService.getYearList();
    this.yearList = JSON.parse(localStorage.getItem('yearList'));
    this.yearList.push({
      value: 0,
      name: 'За все время'
    });
    this.yearList = this.yearList.reverse();
    localStorage.removeItem('yearList');

    this.regionService.getAll().subscribe(regions => {
      this.movieService.getAll().subscribe(movies => {
        this.theaterService.getAll().subscribe(theaters => {
          this.theaterReportService.getAll().subscribe(theaterReports => {
            this.contractService.getAll().subscribe(contracts => {
              this.distReportService.getAll().subscribe(distReports => {
                this.distService.getAll().subscribe(distributors => {

                  this.allDistributors = distributors
                  this.allDistReports = distReports.filter(r => r.sent === true && r.confirm === true);

                  this.contracts = contracts.filter(c => c.typeOfCont === 0 && new Date(c.toDate).getFullYear() === this.currentDate.getFullYear());
                  this.notSentTheaterReport = theaterReports.filter(r => r.sent === true && r.confirm === false);
                  regions.push({
                    name: 'Все регионы',
                    code: '',
                    _id: 'all'
                  });
                  this.regions = regions;
                  this.regions = this.regions.reverse();

                  this.moviesForPrint = movies;
                  this.movies = movies;
                  this.movies.push({
                    name: 'Все фильмы',
                    _id: 'all'
                  });
                  this.movies = this.movies.reverse();

                  this.filterTheatersOfRegion = [];
                  this.filterTheatersOfRegion.push({
                    _id: 'all',
                    name: 'Все кинотеатры',
                    regionId: 'all',
                    distId: 'all'
                  });

                  this.selectedMovie = 'all';
                  this.selectedRegion = regions[0]._id;
                  this.selectedYear = this.yearList[0].value;
                  this.selectedMonth = this.months[0].value;
                  this.theaters = theaters;
                  this.allTheaterReports = theaterReports.filter(r => r.sent === true && r.confirm === true);
                  this.allTheaterReports.sort((a, b) => {
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
                  this.changeYear();
                  this.changeMovie();
                  this.changeRegion();
                })
              });
            });
          });
        });
      });
    });
  }

  refresh() {
    this.byMonth = false;
    this.selectedCond = 0;
    this.loadData();
  }

  changeMovie() {
    // this.selectedMovie
    this.filterMovies = [];
    if (this.selectedMovie === 'all') {
      this.filterMovies = this.movies;
      this.isMovie = true;
    } else {
      this.filterMovies = this.movies.filter(m => m._id === this.selectedMovie)
      this.isMovie = false;
      if (this.isMovie && !this.isOneTheater || !this.isMovie && !this.isOneTheater
        || this.isOneTheater && this.isMovie) {
        this.byMonth = false;
      }
    }
    this.amountReport();

  }

  changeRegion() {
    this.selectedTheater = this.filterTheatersOfRegion[0]._id
    if (this.selectedRegion === 'all') {
      this.isTheater = false;
      this.isOneTheater = false;
      this.filterRegions = this.regions;
      this.selectedCond = 0;
    } else {
      this.filterRegions = this.regions.filter(r => r._id === this.selectedRegion)
      this.isTheater = true;
      this.filterTheatersOfRegion = [];
      this.filterTheatersOfRegion = this.theaters.filter(th => th.regionId === this.selectedRegion)
      this.filterTheatersOfRegion.push({
        _id: 'all',
        name: 'Все кинотеатры',
        regionId: 'all',
        distId: 'all'
      });
      this.filterTheatersOfRegion = this.filterTheatersOfRegion.reverse();
      this.selectedTheater = this.filterTheatersOfRegion[0]._id
      this.selectedCond = 2;
      if (this.isOneTheater) {
        this.isOneTheater = false;
      }
      if (this.isOneTheater && this.byMonth) {
        this.isOneTheater = false;
        this.ofMonth();
      }
    }
    this.amountReport();
  }

  changeTheater() {
    this.filterTheatersOfTheater = [];
    if (this.selectedTheater === 'all') {
      this.isOneTheater = false;
      this.filterTheatersOfTheater = this.theaters;
    } else {
      this.selectedCond = 0;
      this.isOneTheater = true;
      this.filterTheatersOfTheater = this.theaters.filter(th => th._id === this.selectedTheater)
    }
    this.amountReport();
    if (this.byMonth && !this.isOneTheater) {
      this.selectedCond = 2;
      this.ofMonth();
    } else if (!this.byMonth && !this.isOneTheater) {
      this.selectedCond = 2;
    }
  }

  changeSelectedCond() {
    // this.selectedCond
    this.amountReport();
  }

  ofMonth() {
    //------By Month Start------//
    if (this.byMonth) {
      this.reportsTotalOne = [];
      this.reportsTotalTwo = [];
      this.reportsForPrint = [];
      if (this.selectedMonth === 12) {

        for (let i = 0; i < this.months.length; i++) {

          if (this.months[i].value != 12) {
            this.filterTheaterReports = [];
            this.filterDistReport = [];
            if (this.selectedRegion != 'all') {

              //Theater Reports
              if (this.selectedTheater === 'all' && this.isTheater === true) {
                this.filterTheaters = this.theaters.filter(th => th.regionId === this.selectedRegion)
              } else if (this.selectedTheater != 'all' && this.isTheater === true) {
                this.filterTheaters = this.theaters.filter(th => th._id === this.selectedTheater)
              } else {
                this.filterTheaters = this.theaters.filter(th => th.regionId === this.selectedRegion)
              }
              this.filterTheaterReports = [];
              this.filterDistReport = [];
              for (let j = 0; j < this.filterTheaters.length; j++) {
                for (let m = 0; m < this.theaterReports.length; m++) {
                  if (this.filterTheaters[j]._id === this.theaterReports[m].theaterId &&
                    new Date(this.theaterReports[m].date).getMonth() === this.months[i].value) {
                    this.filterTheaterReports.push(this.theaterReports[m])
                  }
                }
              }
              //Distributor MobileReports
              this.distributors = this.allDistributors.filter(d => d.regionId === this.selectedRegion);
              for (let j = 0; j < this.distributors.length; j++) {
                for (let m = 0; m < this.distReports.length; m++) {
                  if (this.distributors[j]._id === this.distReports[m].distId &&
                    new Date(this.distReports[m].date).getMonth() === this.months[i].value) {
                    this.filterDistReport.push(this.distReports[m])
                  }
                }
              }
            } else {
              this.filterTheaterReports = this.theaterReports.filter(r => new Date(r.date).getMonth() === this.months[i].value)
              this.filterDistReport = this.distReports.filter(r => new Date(r.date).getMonth() === this.months[i].value)
            }

            this.reportTotal = new TotalReport();
            this.reportTotal.report = [];
            this.reportTotal.name = this.months[i].name;
            this.reportTotal.totalAmount = 0;
            this.reportTotal.totalTicketCount = 0;

            //Theater Reports
            if (this.filterTheaterReports.length) {
              for (let j = 0; j < this.filterTheaterReports.length; j++) {
                for (let u = 0; u < this.filterTheaterReports[j].withCont.length; u++) {

                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterTheaterReports[j].withCont[u].price * this.filterTheaterReports[j].withCont[u].ticketCount
                  this.oneReport.movieId = this.filterTheaterReports[j].withCont[u].movieId;
                  this.oneReport.regionId = this.theaters.find(th => th._id === this.filterTheaterReports[j].theaterId).regionId
                  this.oneReport.theaterId = this.theaters.find(th => th._id === this.filterTheaterReports[j].theaterId)._id
                  this.oneReport.ticketCount = this.filterTheaterReports[j].withCont[u].ticketCount;

                  this.reportTotal.totalAmount += this.oneReport.amount;
                  this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  if (this.isMovie && !this.isOneTheater) {
                    if (this.selectedCond === 0) {
                      if (this.reportTotal.report.some(r => r.regionId === this.oneReport.regionId)) {
                        this.associationRegionReport(this.reportTotal.report, this.oneReport)
                      } else if (this.reportTotal.report.some(r => r.movieId === this.oneReport.movieId)) {
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      } else {
                        this.reportTotal.report.push(this.oneReport)
                      }
                    }

                    if (this.selectedCond === 1) {
                      this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    }

                    if (this.selectedCond === 2) {
                      if (this.reportTotal.report.some(r => r.theaterId === this.oneReport.theaterId)) {
                        this.associationTheaterReport(this.reportTotal.report, this.oneReport)
                      } else if (this.reportTotal.report.some(r => r.movieId === this.oneReport.movieId)) {
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      } else {
                        this.reportTotal.report.push(this.oneReport)

                      }
                    }

                  } else if (this.isMovie && this.isOneTheater) {
                    this.associationMovieReport(this.reportTotal.report, this.oneReport)
                  }
                  this.reportsForPrint.push(this.oneReport);
                }
              }
            }

            //Distributor MobileReports
            if (this.filterDistReport.length) {
              for (let j = 0; j < this.filterDistReport.length; j++) {
                for (let u = 0; u < this.filterDistReport[j].mobileTheaters.length; u++) {
                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterDistReport[j].mobileTheaters[u].price * this.filterDistReport[j].mobileTheaters[u].ticketCount
                  this.oneReport.movieId = this.filterDistReport[j].mobileTheaters[u].movieId;
                  this.oneReport.theaterId = this.filterDistReport[j].distId;
                  this.oneReport.regionId = this.allDistributors.find(d => d._id === this.filterDistReport[j].distId).regionId
                  this.oneReport.ticketCount = this.filterDistReport[j].mobileTheaters[u].ticketCount;

                  this.reportTotal.totalAmount += this.oneReport.amount;
                  this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  if (this.isMovie && !this.isOneTheater) {
                    if (this.selectedCond === 0) {
                      if (this.reportTotal.report.some(r => r.regionId === this.oneReport.regionId)) {
                        this.associationRegionReport(this.reportTotal.report, this.oneReport)
                      } else if (this.reportTotal.report.some(r => r.movieId === this.oneReport.movieId)) {
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      } else {
                        this.reportTotal.report.push(this.oneReport)
                      }
                    }

                    if (this.selectedCond === 1) {
                      this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    }

                    if (this.selectedCond === 2) {
                      if (this.reportTotal.report.some(r => r.theaterId === this.oneReport.theaterId)) {
                        this.associationTheaterReport(this.reportTotal.report, this.oneReport)
                      } else if (this.reportTotal.report.some(r => r.movieId === this.oneReport.movieId)) {
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      } else {
                        this.reportTotal.report.push(this.oneReport)

                      }
                    }

                  } else if (this.isMovie && this.isOneTheater) {

                  }
                  if (!this.isOneTheater) {
                    this.reportsForPrint.push(this.oneReport);
                  }
                }
              }
            }
            if (this.reportTotal.report.length != 0) {
              this.reportsTotalOne.push(this.reportTotal)
            }

          }
        }
      }
      this.totalAmount = 0;
      this.totalTicketCount = 0;
      for (let i = 0; i < this.reportsTotalOne.length; i++) {
        this.totalAmount += this.reportsTotalOne[i].totalAmount;
        this.totalTicketCount += this.reportsTotalOne[i].totalTicketCount;
      }
    } else {
      this.amountReport();
    }
    //------By Month End------//
  }

  changeYear() {
    if (this.selectedYear === 0) {
      this.theaterReports = this.allTheaterReports;
      this.distReports = this.allDistReports;
      this.isMonth = false;
      this.selectedMonth = 12;
      this.byMonth = false;
      this.amountReport();
    } else {
      this.theaterReports = this.allTheaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear);

      this.distReports = this.allDistReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear);
      this.isMonth = true;
      this.changeMonth();
    }
  }

  changeMonth() {
    if (this.selectedMonth === 12) {
      this.theaterReports = this.allTheaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear);
      this.distReports = this.allDistReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear);
      this.isOneMonth = false;
    } else {
      this.theaterReports = this.allTheaterReports.filter(r =>
        new Date(r.date).getFullYear() === this.selectedYear &&
        new Date(r.date).getMonth() === this.selectedMonth);

      this.distReports = this.allDistReports.filter(r =>
        new Date(r.date).getFullYear() === this.selectedYear &&
        new Date(r.date).getMonth() === this.selectedMonth);
      this.byMonth = false;
      this.isOneMonth = true
    }
    this.amountReport();
  }

  amountReport() {
    if (this.byMonth) {
      this.ofMonth();
    } else {
      this.filterTheaters = [];
      this.filterTheaterReports = [];
      //------Selected one Region End------//
      this.getReportOfRegion();
      //------By Movie Start------//
      //По фильмам
      if ((this.selectedCond === 1 && !this.byMonth)
        || (!this.isMovie && !this.isTheater && !this.byMonth) ||
        (this.isTheater && !this.isMovie && !this.isOneTheater)) {
        if (!this.reportsTotalOne) {
          this.getReportOfRegion();
        }
        this.reportsTotalTwo = [];
        for (let b = 0; b < this.filterMovies.length; b++) {
          if (this.filterMovies[b]._id != 'all') {
            this.reportTotal = new TotalReport();
            this.reportTotal.name = this.filterMovies[b].name;
            this.reportTotal.report = [];
            this.reportTotal.totalAmount = 0;
            this.reportTotal.totalTicketCount = 0;

            for (let i = 0; i < this.reportsTotalOne.length; i++) {
              for (let j = 0; j < this.reportsTotalOne[i].report.length; j++) {
                if (this.filterMovies[b]._id === this.reportsTotalOne[i].report[j].movieId) {
                  this.reportTotal.report.push(this.reportsTotalOne[i].report[j]);
                  this.reportTotal.totalAmount += this.reportsTotalOne[i].report[j].amount;
                  this.reportTotal.totalTicketCount += this.reportsTotalOne[i].report[j].ticketCount;
                }
              }
            }
            if (this.reportTotal.report.length != 0) {
              this.reportsTotalTwo.push(this.reportTotal)
            }
          }
        }
        this.reportsTotalOne = this.reportsTotalTwo;
      }
      this.totalAmount = 0;
      this.totalTicketCount = 0;
      for (let i = 0; i < this.reportsTotalOne.length; i++) {
        this.totalAmount += this.reportsTotalOne[i].totalAmount;
        this.totalTicketCount += this.reportsTotalOne[i].totalTicketCount;
      }
    }
    //------By Movie End------//
  }

  getReportOfRegion() {
    //------By  Region Start------//
    //по регионам
    this.reportsTotalOne = [];
    this.reportsForPrint = [];
    this.filterDistReport = [];
    for (let i = 0; i < this.filterRegions.length; i++) {
      if (this.filterRegions[i]._id != 'all') {
        //Theaters one Region
        if (this.selectedTheater === 'all' && this.isTheater === true) {
          this.filterTheaters = this.theaters.filter(th => th.regionId === this.filterRegions[i]._id)
        } else if (this.selectedTheater != 'all' && this.isTheater === true) {
          this.filterTheaters = this.theaters.filter(th => th._id === this.selectedTheater)
        } else {
          this.filterTheaters = this.theaters.filter(th => th.regionId === this.filterRegions[i]._id)
        }

        //Distributors one Region
        if(!this.isOneTheater){
          this.distributors = this.allDistributors.filter(d => d.regionId === this.filterRegions[i]._id)
        }

        if (this.filterRegions.length === 1) {
          //Reports one region

          //Theater Reports
          for (let j = 0; j < this.filterTheaters.length; j++) {
            this.filterTheaterReports = this.theaterReports.filter(r => r.theaterId === this.filterTheaters[j]._id)
            if (this.filterTheaterReports) {
              this.reportTotal = new TotalReport();
              this.reportTotal.report = [];
              this.reportTotal.name = this.filterTheaters[j].name;
              this.reportTotal.totalAmount = 0;
              this.reportTotal.totalTicketCount = 0;
              for (let n = 0; n < this.filterTheaterReports.length; n++) {
                for (let u = 0; u < this.filterTheaterReports[n].withCont.length; u++) {
                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterTheaterReports[n].withCont[u].price * this.filterTheaterReports[n].withCont[u].ticketCount
                  this.oneReport.movieId = this.filterTheaterReports[n].withCont[u].movieId;
                  this.oneReport.theaterId = this.filterTheaters[j]._id;
                  this.oneReport.date = this.filterTheaterReports[n].date;
                  this.oneReport.ticketCount = this.filterTheaterReports[n].withCont[u].ticketCount;
                  if (this.isMovie && !this.isOneTheater || !this.isMovie && !this.isOneTheater
                    || this.isOneTheater && this.isMovie) {
                    if (!this.isMovie) {
                      if (this.oneReport.movieId === this.selectedMovie) {
                        this.reportTotal.totalAmount += this.oneReport.amount;
                        this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      }
                    } else {
                      this.reportTotal.totalAmount += this.oneReport.amount;
                      this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                      this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    }
                  }
                  if (!this.isMovie && this.isOneTheater) {
                    //one theater and one movie
                    if (this.oneReport.movieId === this.selectedMovie) {
                      this.reportTotal.totalAmount += this.oneReport.amount;
                      this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                      this.associationDateReport(this.reportTotal.report, this.oneReport)
                    }
                  }
                  this.reportsForPrint.push(this.oneReport);
                }
              }
              if (this.reportTotal.report.length != 0) {
                this.reportsTotalOne.push(this.reportTotal)
              }
            }
          }
          //Distributor MobileReports
          if(!this.isOneTheater){
          for (let j = 0; j < this.distributors.length; j++) {
            this.filterDistReport = this.distReports.filter(r => r.distId === this.distributors[j]._id)
            if (this.filterDistReport) {
              this.reportTotal = new TotalReport();
              this.reportTotal.report = [];
              this.reportTotal.name = this.distributors[j].name;
              this.reportTotal.totalAmount = 0;
              this.reportTotal.totalTicketCount = 0;
              for (let n = 0; n < this.filterDistReport.length; n++) {
                for (let u = 0; u < this.filterDistReport[n].mobileTheaters.length; u++) {
                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterDistReport[n].mobileTheaters[u].price * this.filterDistReport[n].mobileTheaters[u].ticketCount
                  this.oneReport.movieId = this.filterDistReport[n].mobileTheaters[u].movieId;
                  this.oneReport.theaterId = this.distributors[j]._id;
                  this.oneReport.date = this.filterDistReport[n].date;
                  this.oneReport.ticketCount = this.filterDistReport[n].mobileTheaters[u].ticketCount;
                  if (this.isMovie && !this.isOneTheater || !this.isMovie && !this.isOneTheater
                    || this.isOneTheater && this.isMovie) {
                    if (!this.isMovie) {
                      if (this.oneReport.movieId === this.selectedMovie) {
                        this.reportTotal.totalAmount += this.oneReport.amount;
                        this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                        this.associationMovieReport(this.reportTotal.report, this.oneReport)
                      }
                    } else {
                      this.reportTotal.totalAmount += this.oneReport.amount;
                      this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                      this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    }
                  }
                  if (!this.isOneTheater) {
                    this.reportsForPrint.push(this.oneReport);
                  }
                }
              }
              if (this.reportTotal.report.length != 0) {
                this.reportsTotalOne.push(this.reportTotal)
              }
            }
          }
        }
        } else {
          //Reports All region
          this.filterTheaterReports = [];
          this.filterDistReport = [];
          //Theater Reports
          for (let j = 0; j < this.filterTheaters.length; j++) {
            for (let m = 0; m < this.theaterReports.length; m++) {
              if (this.filterTheaters[j]._id === this.theaterReports[m].theaterId) {
                this.filterTheaterReports.push(this.theaterReports[m])
              }
            }
          }
          //Distributor Reports
          for (let j = 0; j < this.distributors.length; j++) {
            for (let m = 0; m < this.distReports.length; m++) {
              if (this.distributors[j]._id === this.distReports[m].distId) {
                this.filterDistReport.push(this.distReports[m])
              }
            }
          }
          this.reportTotal = new TotalReport();
          this.reportTotal.report = [];
          this.reportTotal.name = this.filterRegions[i].name;
          this.reportTotal.totalAmount = 0;
          this.reportTotal.totalTicketCount = 0;

          //Theater Reports
          if (this.filterTheaterReports.length) {
            for (let n = 0; n < this.filterTheaterReports.length; n++) {
              for (let u = 0; u < this.filterTheaterReports[n].withCont.length; u++) {
                this.oneReport = new ReportOfTotalReport();
                this.oneReport.amount = this.filterTheaterReports[n].withCont[u].price * this.filterTheaterReports[n].withCont[u].ticketCount
                this.oneReport.movieId = this.filterTheaterReports[n].withCont[u].movieId;
                this.oneReport.regionId = this.filterRegions[i]._id;
                this.oneReport.date = this.filterTheaterReports[n].date;
                this.oneReport.ticketCount = this.filterTheaterReports[n].withCont[u].ticketCount;
                if (this.isMovie) {
                  this.reportTotal.totalAmount += this.oneReport.amount;
                  this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  this.associationMovieReport(this.reportTotal.report, this.oneReport)
                } else {
                  if (this.oneReport.movieId === this.selectedMovie) {
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                    this.associationMovieReport(this.reportTotal.report, this.oneReport)
                  }
                }
                this.reportsForPrint.push(this.oneReport);
              }
            }
          }

          //Distributor MobileReports
          if (this.filterDistReport.length) {
            for (let n = 0; n < this.filterDistReport.length; n++) {
              for (let u = 0; u < this.filterDistReport[n].mobileTheaters.length; u++) {
                this.oneReport = new ReportOfTotalReport();
                this.oneReport.amount = this.filterDistReport[n].mobileTheaters[u].price * this.filterDistReport[n].mobileTheaters[u].ticketCount
                this.oneReport.movieId = this.filterDistReport[n].mobileTheaters[u].movieId;
                this.oneReport.regionId = this.filterRegions[i]._id;
                this.oneReport.date = this.filterDistReport[n].date;
                this.oneReport.ticketCount = this.filterDistReport[n].mobileTheaters[u].ticketCount;
                if (this.isMovie) {
                  this.reportTotal.totalAmount += this.oneReport.amount;
                  this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  this.associationMovieReport(this.reportTotal.report, this.oneReport)
                } else {
                  if (this.oneReport.movieId === this.selectedMovie) {
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                    this.associationMovieReport(this.reportTotal.report, this.oneReport)
                  }
                }
                this.reportsForPrint.push(this.oneReport);
              }
            }
          }
          if (this.reportTotal.report.length != 0) {
            this.reportsTotalOne.push(this.reportTotal)
          }
        }
      }
    }
    //------By All Region End------//
  }

  associationMovieReport(reports: ReportOfTotalReport[], report: ReportOfTotalReport) {
    if (reports.length) {
      for (let i = 0; i < reports.length; i++) {
        if (reports[i].movieId === report.movieId) {
          reports[i].amount += report.amount;
          reports[i].ticketCount += report.ticketCount;
        }
      }
      if (!reports.some(r => r.movieId === report.movieId)) {

        reports.push(report)
      }

    } else {
      reports.push(report)
    }
  }

  associationRegionReport(reports: ReportOfTotalReport[], report: ReportOfTotalReport) {
    if (reports.length) {
      for (let i = 0; i < reports.length; i++) {
        if (reports[i].regionId === report.regionId) {
          reports[i].amount += report.amount;
          reports[i].ticketCount += report.ticketCount;
        }
      }
      if (!reports.some(r => r.regionId === report.regionId)) {

        reports.push(report)
      }

    } else {
      reports.push(report)
    }
  }

  associationTheaterReport(reports: ReportOfTotalReport[], report: ReportOfTotalReport) {
    if (reports.length) {
      for (let i = 0; i < reports.length; i++) {
        if (reports[i].theaterId === report.theaterId) {
          reports[i].amount += report.amount;
          reports[i].ticketCount += report.ticketCount;
        }
      }
      if (!reports.some(r => r.theaterId === report.theaterId)) {

        reports.push(report)
      }

    } else {
      reports.push(report)
    }
  }

  associationDateReport(reports: ReportOfTotalReport[], report: ReportOfTotalReport) {
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

  print() {
    $("#print-section").print();
  }

  setPrintTitle(): string {
    let result: string = null;
    if (this.reportsForPrint) {
      this.reportsForPrint.sort((a, b) => {
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
      this.startDateOfReports = null;
      this.endDateOfReports = null;
      if (this.reportsForPrint[this.reportsForPrint && this.reportsForPrint[0] && this.reportsForPrint.length - 1]) {
        this.startDateOfReports = this.datePipe.transform(this.reportsForPrint[this.reportsForPrint.length - 1].date, 'dd.MM.yyyy');
        this.endDateOfReports = this.datePipe.transform(this.reportsForPrint[0].date, 'dd.MM.yyyy');
      }
      if (this.selectedRegion === "all") {
        if (this.selectedMovie !== "all") {
          result = "Детальный отчёт по фильму " +
          this.movies?this.movies.find(i => i._id === this.selectedMovie).name:'' +
            " по всей Республике в период с " + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        } else {
          result = "Общий отчёт по всей Республике относительно всех фильмов, которые были в прокате в период с "
            + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        }
      } else {
        if (this.selectedTheater === "all") {
          if (this.selectedMovie === "all") {
            // B
            result = "Общий отчёт по всем кинотеатрам региона "
              + this.regions.find(i => i._id === this.selectedRegion).name
              + " в период с " + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
          } else {
            // E
            result = "Детальный отчёт по фильму " +
            this.movies?this.movies.find(i => i._id === this.selectedMovie).name:'' +
              " относительно всех кинотеатров региона " +
              this.regions.find(i => i._id === this.selectedRegion).name + " " +
              "в период с " + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
          }
        } else {
          if (this.selectedMovie === "all") {
            // C
            result = "Детальный отчёт по кинотеатру " +
              this.filterTheatersOfRegion.find(i => i._id === this.selectedTheater).name +
              " (" + this.regions.find(i => i._id === this.selectedRegion).name + ") в период с " +
              this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
          } else {
            // D
            result = "Детальный отчёт по фильму " +
              this.movies.find(i => i._id === this.selectedMovie).name +
              " относительно кинотеатра " +
              this.filterTheatersOfRegion.find(i => i._id === this.selectedTheater).name +
              " (" + this.regions.find(i => i._id === this.selectedRegion).name + ") в период с " +
              this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
          }
        }
      }

      return result;
    }
  }
}

export class Movie {
  _id: string;
  name: string;
}

export class Theater {
  _id: string;
  name: string;
  regionId: string;
  distId: string;

}

export class TotalReport {
  name: string;
  report: ReportOfTotalReport[];
  totalAmount: number;
  totalTicketCount: number;
}

export class ReportOfTotalReport {
  movieId: string;
  regionId: string;
  distId: string;
  theaterId: string;
  ticketCount: number;
  amount: number;
  date: Date;
}

class Year {
  value: number;
  name: string;
}
