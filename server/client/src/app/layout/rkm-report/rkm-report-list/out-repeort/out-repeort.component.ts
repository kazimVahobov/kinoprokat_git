import { Component, OnInit, Input } from '@angular/core';
import {
  DistributorModel,
  DistributorReportModel,
  PagerService,
  DistributorReportService,
  TheaterReportService,
  TheaterReportModel,
  TheaterModel,
  TheaterService,
  DistributorService,
  PermissionService
} from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-out-detail-repeort',
  templateUrl: './out-repeort.component.html',
  styleUrls: ['./out-repeort.component.scss']
})
export class OutRepeortComponent implements OnInit {

  @Input() currentDateforDist: string;

  distributorReports: DistributorReportModel[];
  distributorReport: DistributorReportModel;
  distributors: DistributorModel[] = [];

  tempReports: TheaterReportModel[];
  theaterReport: TheaterReportModel;
  theaters: TheaterModel[] = [];
  currentTheater: TheaterModel;


  reports: Report[] = [];
  finalReports: Report[];
  tempReport: Report;

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];

  currentUser = JSON.parse(localStorage.getItem('user'));
  filterReport: any = {};
  isConfirm = false;

  constructor(
    private pagerService: PagerService,
    private service: DistributorReportService,
    private theaterReportService: TheaterReportService,
    private theaterService: TheaterService,
    private router: Router,
    private distributorService: DistributorService,
    private permissionService: PermissionService
  ) { }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.distributorReport = new DistributorReportModel();
    this.loadData();

    if (this.permissionService.reportRKM) {
      for (let i = 0; i < this.permissionService.reportRKM.length; i++) {
        if (this.permissionService.reportRKM[i].value === 4) {
          this.isConfirm = true;
        }
      }
    }

  }

  detailRouter(id: string) {
    this.filterReport.currentDate = this.currentDateforDist;
    this.filterReport.currentMode = 0;
    window.localStorage.setItem('filterReport', JSON.stringify(this.filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: { id: id }
    });
  }

  loadData() {

    this.service.getAll().subscribe(distributorReports => {
      this.theaterService.getAll().subscribe(theaters => {
        if(this.currentUser.distId) {
          this.theaters = theaters.filter(item => item.distId === this.currentUser.distId);
        } else {
          this.theaters = theaters;
        }

        this.theaterReportService.getAll().subscribe(theaterReports => {
          this.distributorService.getAll().subscribe(distributors => {

            this.distributors = distributors

            if (this.currentDateforDist) {
              this.distributorReports = distributorReports.filter(r => (r.sent === true) &&
                new Date(r.date).toDateString() === new Date(this.currentDateforDist).toDateString());
            } else {
              this.distributorReports = distributorReports.filter(r => (r.sent === true));
            }
            this.finalReports = [];

            for (let a = 0; a < this.distributorReports.length; a++) {

              this.theaterReport = new TheaterReportModel();
              this.currentTheater = new TheaterModel();
              this.tempReports = [];
              this.reports = [];

              // this.tempReports = theaterReports.filter(item =>
              //   this.distributorReports[a].theaterReports.some(th =>
              //     item._id === th.theaterReportsId));

              for (let i = 0; i < this.tempReports.length; i++) {

                this.tempReport = new Report();
                this.tempReport.movies = [];
                this.tempReport.theaterId = this.tempReports[i].theaterId
                this.tempReport.ticketCount = 0;
                this.tempReport.summ = 0;
                this.tempReport.sessionCount = this.tempReports[i].withCont.length;

                for (let j = 0; j < this.tempReports[i].withCont.length; j++) {
                  if (!this.tempReport.movies.some(item => item === this.tempReports[i].withCont[j].movieId)) {
                    this.tempReport.movies.push(this.tempReports[i].withCont[j].movieId);
                  }
                  this.tempReport.ticketCount += this.tempReports[i].withCont[j].ticketCount;
                  this.tempReport.summ += this.tempReports[i].withCont[j].ticketCount * this.tempReports[i].withCont[j].price;
                }
                this.reports.push(this.tempReport);
              }

              this.tempReport = new Report();
              this.tempReport.moviesCount = 0;
              this.tempReport.theaterCount = 0;
              this.tempReport.ticketCount = 0;
              this.tempReport.sessionCount = 0;
              this.tempReport.summ = 0;
              this.tempReport.mobTheater = false;
              this.tempReport.date = this.distributorReports[a].date;
              this.tempReport.distId = this.distributorReports[a].distId;
              this.tempReport.confirm = this.distributorReports[a].confirm;
              this.tempReport.sent = this.distributorReports[a].sent;
              this.tempReport._id = this.distributorReports[a]._id;
              if (this.distributorReports[a].mobileTheaters.length != 0) {
                this.tempReport.mobTheater = true;
              }
              for (let i = 0; i < this.reports.length; i++) {
                this.tempReport.moviesCount += this.reports[i].movies.length;
                this.tempReport.theaterCount += 1;
                this.tempReport.sessionCount += this.reports[i].sessionCount;
                this.tempReport.ticketCount += this.reports[i].ticketCount;
                this.tempReport.summ += this.reports[i].summ;
              }
              this.finalReports.push(this.tempReport)
            }
            this.finalReports.sort((a, b) => {
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
            this.setPage(1);
          });
        });
      });
    });
  }

  confirmReport(id: any) {
    this.distributorReport._id = id;
    this.distributorReport.sent = true;
    this.distributorReport.confirm = true;
    this.service.update(this.distributorReport).subscribe(report => {
      this.loadData();
    },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  cancelReport(id: any) {
    this.distributorReport._id = id;
    this.distributorReport.sent = false;
    this.distributorReport.confirm = false;
    this.service.update(this.distributorReport).subscribe(report => {
      this.loadData();
    },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.finalReports.length, page);
    this.pagedItems = this.finalReports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}



class Report {
  _id: string;
  date: Date;
  theaterId: string;
  distId: string;
  theaterCount: number;
  movies: string[];
  moviesCount: number;
  sessionCount: number;
  ticketCount: number;
  summ: number;
  sent: boolean;
  confirm: boolean;
  mobTheater: boolean;
}
