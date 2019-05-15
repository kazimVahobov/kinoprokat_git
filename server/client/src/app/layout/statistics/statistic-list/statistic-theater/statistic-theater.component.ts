import { Component, OnInit } from '@angular/core';
import {
  ContractModel,
  TheaterReportModel,
  TheaterService,
  ContractService,
  TheaterReportService,
  MovieService,
  TheaterModel,
  YearListService,
  DistributorService,
  RegionService,
  DistributorModel,
  MovieModel,
  RegionModel
} from 'src/app/core';
import {
  Movie,
  TotalReport,
  ReportOfTotalReport
} from '../statistic-rkm/statistic-rkm.component';
import { DatePipe } from "@angular/common";

declare var $;

@Component({
  selector: 'app-statistic-theater',
  templateUrl: './statistic-theater.component.html',
  styleUrls: ['./statistic-theater.component.scss']
})
export class StatisticTheaterComponent implements OnInit {
  theater: TheaterModel;
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

  selectedYear: number;
  selectedMonth: number;
  selectedMovie: string;

  isMovie = true;
  isMonth = false;
  isOneMonth = false;
  byMonth = false;
  //Filter
  filterTheaterReports: TheaterReportModel[];
  theaterReports: TheaterReportModel[];
  movies: Movie[];
  //Total
  reportTotal: TotalReport;
  oneReport: ReportOfTotalReport;
  reportsTotal: TotalReport[];
  totalAmount: number;
  totalTicketCount: number;
  yearList: Year[];
  currentUser = JSON.parse(localStorage.getItem('user'));

  startDateOfReports: string = null;
  endDateOfReports: string = null;
  reportsForPrint: ReportOfTotalReport[];
  moviesForPrint: MovieModel[];
  theaters: TheaterModel[];
  regions: RegionModel[];
  distributors: DistributorModel[];
  currentRegionName: string = null;
  currentTheaterName: string = null;

  constructor(private movieService: MovieService,
    private theaterReportService: TheaterReportService,
    private contractService: ContractService,
    private theaterService: TheaterService,
    private yearListService: YearListService,
    private regionService: RegionService,
    private distributorService: DistributorService,
    public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.theaters = [];
    this.moviesForPrint = [];
    this.regions = [];
    this.distributors = [];
    this.movies = [];
    this.theater = new TheaterModel();
    this.reportTotal = new TotalReport();
    this.theaterReports = [];
    this.contracts = [];
    this.reportsTotal = [];
    this.totalAmount = 0;
    this.totalTicketCount = 0;
    //getByFilter:
    this.filterTheaterReports = [];

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
                this.theaters = theaters;
                this.distributors = distributors;
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
                this.theater = theaters.find(th => th._id === this.currentUser.theaterId);
                this.theaterReports = theaterReports.filter(r => r.sent === true &&
                  r.confirm === true && r.theaterId === this.currentUser.theaterId);
                this.theaterReports.sort((a, b) => {
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
                this.changeMovie();
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
    this.loadData();
  }

  changeMovie() {
    // this.selectedMovie
    this.isMovie = this.selectedMovie === 'all';
    this.changeYear();
  }

  ofMonth() {
    //------By Month Start------//
    if (this.byMonth && this.selectedYear != 0) {
      if (this.selectedMonth === 12) {
        this.reportsTotal = [];
        this.reportsForPrint = [];
        for (let i = 0; i < this.months.length; i++) {
          if (this.months[i].value != 12) {

            this.filterTheaterReports = this.theaterReports.filter(r => new Date(r.date).getMonth() === this.months[i].value)

            if (this.filterTheaterReports.length) {
              this.reportTotal = new TotalReport();
              this.reportTotal.report = [];
              this.reportTotal.name = this.months[i].name;
              this.reportTotal.totalAmount = 0;
              this.reportTotal.totalTicketCount = 0;
              for (let j = 0; j < this.filterTheaterReports.length; j++) {
                for (let u = 0; u < this.filterTheaterReports[j].withCont.length; u++) {

                  this.oneReport = new ReportOfTotalReport();
                  this.oneReport.amount = this.filterTheaterReports[j].withCont[u].price * this.filterTheaterReports[j].withCont[u].ticketCount
                  this.oneReport.movieId = this.filterTheaterReports[j].withCont[u].movieId;
                  this.oneReport.theaterId = this.theater._id
                  this.oneReport.ticketCount = this.filterTheaterReports[j].withCont[u].ticketCount;

                  this.reportTotal.totalAmount += this.oneReport.amount;
                  this.reportTotal.totalTicketCount += this.oneReport.ticketCount;

                  this.associationMovieReport(this.reportTotal.report, this.oneReport);
                  this.reportsForPrint.push(this.oneReport);
                }
              }
              this.reportsTotal.push(this.reportTotal);
              this.filterTheaterReports = [];
            }
          }
        }
        this.totalAmount = 0;
        this.totalTicketCount = 0;
        for (let i = 0; i < this.reportsTotal.length; i++) {
          this.totalAmount += this.reportsTotal[i].totalAmount;
          this.totalTicketCount += this.reportsTotal[i].totalTicketCount;
        }
      }
    } else {
      this.changeYear();
    }
    //------By Month End------//
  }

  changeYear() {
    this.filterTheaterReports = [];
    if (this.selectedYear === 0) {
      this.filterTheaterReports = this.theaterReports;
      this.isMonth = false;
      this.selectedMonth = 12;
      if (this.byMonth && this.isMovie) {
        this.ofMonth();
      } else {
        this.byMonth = false;
        this.amountReport();
      }
    } else {
      this.filterTheaterReports = this.theaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.isMonth = true;
      this.changeMonth();
    }
  }

  changeMonth() {
    if (this.selectedMonth === 12) {
      this.filterTheaterReports = this.theaterReports.filter(r => new Date(r.date).getFullYear() === this.selectedYear)
      this.isOneMonth = false;
    } else {
      this.filterTheaterReports = this.theaterReports.filter(r =>
        new Date(r.date).getFullYear() === this.selectedYear &&
        new Date(r.date).getMonth() === this.selectedMonth)
      this.byMonth = false;
      this.isOneMonth = true
    }
    if (this.byMonth) {
      this.ofMonth();
    } else {
      this.amountReport();
    }
  }

  print() {
    $("#print-section").print();
  }

  amountReport() {
    this.reportsForPrint = [];
    this.reportsTotal = [];
    this.reportTotal = new TotalReport();
    this.reportTotal.report = [];
    this.reportTotal.name = this.theater.name;
    this.reportTotal.totalAmount = 0;
    this.reportTotal.totalTicketCount = 0;
    for (let n = 0; n < this.filterTheaterReports.length; n++) {
      for (let u = 0; u < this.filterTheaterReports[n].withCont.length; u++) {
        this.oneReport = new ReportOfTotalReport();
        this.oneReport.amount = this.filterTheaterReports[n].withCont[u].price * this.filterTheaterReports[n].withCont[u].ticketCount
        this.oneReport.movieId = this.filterTheaterReports[n].withCont[u].movieId;
        this.oneReport.theaterId = this.theater._id
        this.oneReport.date = this.filterTheaterReports[n].date;
        this.oneReport.ticketCount = this.filterTheaterReports[n].withCont[u].ticketCount;
        if (!this.isMovie) {
          if (this.selectedMovie === this.oneReport.movieId) {
            this.reportTotal.totalAmount += this.oneReport.amount;
            this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
            this.associationDateReport(this.reportTotal.report, this.oneReport)
          }
        }
        if (this.selectedMovie === 'all') {
          this.reportTotal.totalAmount += this.oneReport.amount;
          this.reportTotal.totalTicketCount += this.oneReport.ticketCount;
          this.associationMovieReport(this.reportTotal.report, this.oneReport)
        }
        this.reportsForPrint.push(this.oneReport);
      }
    }
    this.reportsTotal.push(this.reportTotal);
    this.totalAmount = 0;
    this.totalTicketCount = 0;
    for (let i = 0; i < this.reportsTotal.length; i++) {
      this.totalAmount += this.reportsTotal[i].totalAmount;
      this.totalTicketCount += this.reportsTotal[i].totalTicketCount;
    }
    this.filterTheaterReports = [];
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
      this.startDateOfReports = this.datePipe.transform(this.reportsForPrint[this.reportsForPrint.length - 1].date, 'dd.MM.yyyy');
      this.endDateOfReports = this.datePipe.transform(this.reportsForPrint[0].date, 'dd.MM.yyyy');
      this.currentRegionName = this.regions.find(i => i._id === this.theaters.find(j => j._id === this.currentUser.theaterId).regionId).name;
      this.currentTheaterName = this.theaters.find(j => j._id === this.currentUser.theaterId).name;
      if (this.selectedMovie === 'all') {
        result = "Детальный отчёт по кинотеатру " +
          this.currentTheaterName +
          " (" + this.currentRegionName + ") в период с " +
          this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
      } else {
        result = "Детальный отчёт по фильму " +
          this.movies.find(i => i._id === this.selectedMovie).name +
          " относительно кинотеатра " +
          this.currentTheaterName +
          " (" + this.currentRegionName + ") в период с " +
          this.startDateOfReports + " г. до " + this.endDateOfReports + " г.";
      }
      return result;
    }
  }
}

class Year {
  value: number;
  name: string;
}
