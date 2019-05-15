import { Component, OnInit } from '@angular/core';
import {
  TheaterService,
  ContractService,
  TheaterReportService,
  MovieService,
  ContractModel,
  TheaterReportModel,
  YearListService,
  RegionService,
  RegionModel,
  MovieModel,
  DistributorModel,
  DistributorService,
  DistributorReportModel,
  DistributorReportService
} from 'src/app/core';
import { Theater, ReportOfTotalReport, TotalReport, Movie } from '../statistic-rkm/statistic-rkm.component';
import { DatePipe } from "@angular/common";

declare var $;

@Component({
  selector: 'app-statistic-dist',
  templateUrl: './statistic-dist.component.html',
  styleUrls: ['./statistic-dist.component.scss']
})
export class StatisticDistComponent implements OnInit {

  movies: Movie[];
  theaterReports: TheaterReportModel[];
  allTheaterReports: TheaterReportModel[];
  distReports: DistributorReportModel[];
  allDistReports: DistributorReportModel[];
  theaters: Theater[];
  contracts: ContractModel[];

  currentDate = new Date();

  parametersPanelIsOpen: boolean = true;

  months = [
    {
      name: 'Все месяцы',
      value: 12
    },
    {
      name: 'Январь ',
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
  selectedTheater: string = 'all';

  isMovie = true;
  isOneTheater = false;
  isMonth = false;
  isOneMonth = false;
  byMonth = false;
  //Filter
  filterTheaters: Theater[];
  filterTheaterReports: TheaterReportModel[];
  filterDistReports: DistributorReportModel[];
  filterMovies: Movie[];
  //Total
  reportsTotalOne: TotalReport[];
  reportsTotalTwo: TotalReport[];
  reportTotal: TotalReport;
  oneReport: ReportOfTotalReport;
  totalAmount: number;
  totalTicketCount: number;
  yearList: Year[];

  currentUser = JSON.parse(localStorage.getItem('user'));
  startDateOfReports: string = null;
  endDateOfReports: string = null;
  reportsForPrint: ReportOfTotalReport[];
  moviesForPrint: MovieModel[];
  regions: RegionModel[];
  distributors: DistributorModel[];
  currentRegionName: string = null;
  currentDist: DistributorModel;

  constructor(private movieService: MovieService,
    private theaterReportService: TheaterReportService,
    private contractService: ContractService,
    private theaterService: TheaterService,
    private yearListService: YearListService,
    private regionService: RegionService,
    private distributorService: DistributorService,
    private distReportService: DistributorReportService,
    public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.distributors = [];
    this.regions = [];
    this.moviesForPrint = [];
    this.reportsForPrint = [];
    this.movies = [];
    this.theaters = [];
    this.theaterReports = [];
    this.contracts = [];
    this.selectedCond = 0;
    this.distReports = [];
    this.allDistReports = [];
    this.currentDist = new DistributorModel();
    //getByFilter:
    this.filterTheaters = [];
    this.filterTheaterReports = [];
    this.filterMovies = [];
    this.filterDistReports = [];
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

    this.movieService.getAll().subscribe(movies => {
      this.theaterService.getAll().subscribe(theaters => {
        this.theaterReportService.getAll().subscribe(theaterReports => {
          this.contractService.getAll().subscribe(contracts => {
            this.regionService.getAll().subscribe(regions => {
              this.distributorService.getAll().subscribe(distributors => {
                this.distReportService.getAll().subscribe(distReports => {

                  this.distributors = distributors;
                  this.currentDist = distributors.find(d => d._id === this.currentUser.distId)
                  this.allDistReports = distReports.filter(r => r.confirm === true && r.sent === true && r.distId === this.currentDist._id);
                  this.regions = regions;
                  this.contracts = contracts.filter(c => c.typeOfCont === 0 && new Date(c.toDate).getFullYear() === this.currentDate.getFullYear())

                  this.moviesForPrint = movies;
                  this.movies = movies;
                  this.movies.push({
                    name: 'Все фильмы',
                    _id: 'all'
                  });
                  this.movies = this.movies.reverse();

                  this.selectedMovie = movies[0]._id;
                  this.selectedYear = this.yearList[0].value;
                  this.selectedMonth = this.months[0].value;
                  this.theaters = theaters.filter(th => th.distId === this.currentUser.distId);
                  this.theaters.push({
                    _id: 'all',
                    name: 'Все кинотеатры',
                    regionId: 'all',
                    distId: 'all'
                  });
                  this.theaters = this.theaters.reverse();
                  this.selectedTheater = this.theaters[0]._id

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
                  this.currentRegionName = this.regions.find(i => i._id === this.distributors.find(j => j._id === this.currentUser.distId).regionId).name;
                  this.changeYear();
                  this.changeTheater();
                  this.changeMovie();
                });
              });
            });
          });
        });
      });
    });
  }

  refresh() {
    this.isOneMonth = false;
    this.isMovie = true;
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
      this.selectedCond = 0;
      if (this.isOneTheater) {
        this.byMonth = false;
      }
    }
    this.amountReport();
  }

  changeTheater() {
    if (this.selectedTheater === 'all') {
      this.isOneTheater = false;
      this.filterTheaters = this.theaters;
      this.filterTheaters = this.theaters;
      this.selectedCond = 0;
    } else {
      this.selectedCond = 1;
      this.isOneTheater = true;
      this.filterTheaters = this.theaters.filter(th => th._id === this.selectedTheater);
    }
    this.amountReport();
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
            this.filterDistReports = [];
            for (let j = 0; j < this.filterTheaters.length; j++) {
              for (let m = 0; m < this.theaterReports.length; m++) {
                if (this.filterTheaters[j]._id === this.theaterReports[m].theaterId &&
                  new Date(this.theaterReports[m].date).getMonth() === this.months[i].value) {
                  this.filterTheaterReports.push(this.theaterReports[m])
                }
              }
            }
            this.filterDistReports = this.distReports.filter(r => new Date(r.date).getMonth() === this.months[i].value)
            this.reportTotal = new TotalReport();
            this.reportTotal.report = [];
            this.reportTotal.name = this.months[i].name;
            this.reportTotal.totalAmount = 0;
            this.reportTotal.totalTicketCount = 0;

            // Theater Reports
            if (this.filterTheaterReports.length) {
              for (let j = 0; j < this.filterTheaterReports.length; j++) {
                for (let u = 0; u < this.filterTheaterReports[j].withCont.length; u++) {

                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterTheaterReports[j].withCont[u].price * this.filterTheaterReports[j].withCont[u].ticketCount
                  this.oneReport.movieId = this.filterTheaterReports[j].withCont[u].movieId;
                  this.oneReport.theaterId = this.theaters.find(th => th._id === this.filterTheaterReports[j].theaterId)._id
                  this.oneReport.ticketCount = this.filterTheaterReports[j].withCont[u].ticketCount;

                  if (this.selectedCond === 1) {
                    this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  }
                  if (this.selectedCond === 0) {
                    this.associationTheaterReport(this.reportTotal.report, this.oneReport)
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  }
                  this.reportsForPrint.push(this.oneReport);
                }
              }

              if (this.reportTotal.report) {
                this.reportsTotalOne.push(this.reportTotal)
              }
            }
            if (this.filterDistReports.length) {
              for (let j = 0; j < this.filterDistReports.length; j++) {
                for (let u = 0; u < this.filterDistReports[j].mobileTheaters.length; u++) {

                  this.oneReport = new ReportOfTotalReport();
                  // this.oneReport.amount = this.filterDistReports[j].mobileTheaters[u].price * this.filterDistReports[j].mobileTheaters[u].ticketCount
                  this.oneReport.movieId = this.filterDistReports[j].mobileTheaters[u].movieId;
                  this.oneReport.theaterId = this.currentDist._id
                  // this.oneReport.ticketCount = this.filterDistReports[j].mobileTheaters[u].ticketCount;

                  if (this.selectedCond === 1) {
                    this.associationMovieReport(this.reportTotal.report, this.oneReport)
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  }
                  if (this.selectedCond === 0) {
                    this.associationTheaterReport(this.reportTotal.report, this.oneReport)
                    this.reportTotal.totalAmount += this.oneReport.amount;
                    this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                  }
                  this.reportsForPrint.push(this.oneReport);
                }
              }

              if (this.reportTotal.report) {
                this.reportsTotalOne.push(this.reportTotal)
              }
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
      if (this.byMonth && this.isMovie) {
        this.ofMonth();
      } else {
        this.byMonth = false;
        this.amountReport();
      }
    } else {
      this.theaterReports = this.allTheaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.distReports = this.allDistReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.isMonth = true;
      this.changeMonth();
    }
  }

  changeMonth() {
    if (this.selectedMonth === 12) {
      this.theaterReports = this.allTheaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.distReports = this.allDistReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.isOneMonth = false;
    } else {

      this.theaterReports = this.allTheaterReports.filter(r =>
        new Date(r.date).getFullYear() === this.selectedYear &&
        new Date(r.date).getMonth() === this.selectedMonth)

      this.distReports = this.allDistReports.filter(r =>
        new Date(r.date).getFullYear() === this.selectedYear &&
        new Date(r.date).getMonth() === this.selectedMonth)

      this.byMonth = false;
      this.isOneMonth = true
    }
    this.amountReport();
  }

  amountReport() {
    if (this.byMonth) {
      this.ofMonth();
    } else {
      this.filterTheaterReports = [];
      this.reportsTotalOne = [];
      this.reportsForPrint = [];
      this.getReportOfTheater();
      //------By Movie Start------//
      //По фильмам
      if ((this.selectedCond === 1 && !this.byMonth && !this.isOneTheater)
        || (!this.isMovie && !this.isOneTheater && !this.byMonth)) {
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
                  this.reportTotal.report.push(this.reportsTotalOne[i].report[j])
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

  getReportOfTheater() {
    //------By  Theater Start------//
    for (let i = 0; i < this.filterTheaters.length; i++) {

      if (this.filterTheaters[i]._id != 'all') {
        this.filterTheaterReports = this.theaterReports.filter(r => r.theaterId === this.filterTheaters[i]._id)
        //Reports all theaters
        this.reportTotal = new TotalReport();
        this.reportTotal.report = [];
        this.reportTotal.name = this.filterTheaters[i].name;
        this.reportTotal.totalAmount = 0;
        this.reportTotal.totalTicketCount = 0;
        //Theater Reports
        for (let n = 0; n < this.filterTheaterReports.length; n++) {
          for (let u = 0; u < this.filterTheaterReports[n].withCont.length; u++) {
            this.oneReport = new ReportOfTotalReport();
            this.oneReport.amount = this.filterTheaterReports[n].withCont[u].price * this.filterTheaterReports[n].withCont[u].ticketCount
            this.oneReport.movieId = this.filterTheaterReports[n].withCont[u].movieId;
            this.oneReport.theaterId = this.filterTheaters[i]._id;
            this.oneReport.date = this.filterTheaterReports[n].date;
            this.oneReport.ticketCount = this.filterTheaterReports[n].withCont[u].ticketCount;
            if (!this.isMovie && this.isOneTheater) {
              //one theater and one movie
              if (this.oneReport.movieId === this.selectedMovie) {
                this.reportTotal.totalAmount += this.oneReport.amount;
                this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
                this.associationDateReport(this.reportTotal.report, this.oneReport)
              }
            } else if (!this.isMovie && !this.isOneTheater) {
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
            this.reportsForPrint.push(this.oneReport);
          }
        }

        this.filterTheaterReports = [];
        if (this.reportTotal.report.length) {
          this.reportsTotalOne.push(this.reportTotal)
        }
      }
    }
    //Reports Distributors
    this.reportTotal = new TotalReport();
    this.reportTotal.report = [];
    this.reportTotal.name = this.currentDist.name;
    this.reportTotal.totalAmount = 0;
    this.reportTotal.totalTicketCount = 0;
    //Distributor Mobile Theater Reports
    for (let n = 0; n < this.distReports.length; n++) {
      for (let u = 0; u < this.distReports[n].mobileTheaters.length; u++) {
        this.oneReport = new ReportOfTotalReport();
        // this.oneReport.amount = this.distReports[n].mobileTheaters[u].price * this.distReports[n].mobileTheaters[u].ticketCount
        this.oneReport.movieId = this.distReports[n].mobileTheaters[u].movieId;
        this.oneReport.theaterId = this.currentDist._id;
        this.oneReport.date = this.distReports[n].date;
        // this.oneReport.ticketCount = this.distReports[n].mobileTheaters[u].ticketCount;
        if (!this.isMovie && this.isOneTheater) {
          //one theater and one movie
          if (this.oneReport.movieId === this.selectedMovie) {
            this.reportTotal.totalAmount += this.oneReport.amount;
            this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
            this.associationDateReport(this.reportTotal.report, this.oneReport)
          }
        } else if (!this.isMovie && !this.isOneTheater) {
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
        this.reportsForPrint.push(this.oneReport);
      }
    }
    if (this.reportTotal.report.length) {
      this.reportsTotalOne.push(this.reportTotal)
    }
    //------By All Theater End------//
  }

  print() {
    $("#print-section").print();
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

  setPrintTitle(): string {
    if (this.reportsForPrint.length !== 0) {
      let result: string = null;

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
      this.startDateOfReports = this.datePipe.transform(this.reportsForPrint[this.reportsForPrint.length - 1].date, 'dd.MM.yyyy');
      this.endDateOfReports = this.datePipe.transform(this.reportsForPrint[0].date, 'dd.MM.yyyy');
      if (this.selectedTheater === "all") {
        if (this.selectedMovie === "all") {
          // A
          result = "Общий отчёт по всем кинотеатрам региона "
            + this.currentRegionName
            + " в период с " + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        } else {
          // D
          result = "Детальный отчёт по фильму " +
            this.movies.find(i => i._id === this.selectedMovie).name +
            " относительно всех кинотеатров региона " +
            this.currentRegionName + " " +
            "в период с " + this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        }
      } else {
        if (this.selectedMovie === "all") {
          // B
          result = "Детальный отчёт по кинотеатру " +
            this.theaters.find(i => i._id === this.selectedTheater).name +
            " (" + this.currentRegionName + ") в период с " +
            this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        } else {
          // C
          result = "Детальный отчёт по фильму " +
            this.movies.find(i => i._id === this.selectedMovie).name +
            " относительно кинотеатра " +
            this.theaters.find(i => i._id === this.selectedTheater).name +
            " (" + this.currentRegionName + ") в период с " +
            this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
        }
      }
      return result;
    }
  }
}

class Year {
  value: number;
  name: string;
}
