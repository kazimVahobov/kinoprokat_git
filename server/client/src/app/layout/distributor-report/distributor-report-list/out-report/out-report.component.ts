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
  PermissionService
} from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-out-report',
  templateUrl: './out-report.component.html',
  styleUrls: ['./out-report.component.scss']
})
export class OutReportComponent implements OnInit {

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

  isDelete = false;
  isEdit = false;
  isCreate = false;

 filterReport: any = {};

  constructor(
    private pagerService: PagerService,
    private service: DistributorReportService,
    private theaterReportService: TheaterReportService,
    private theaterService: TheaterService,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.distributorReport = new DistributorReportModel();
    this.loadData();

    if (this.permissionService.reportDist) {
      for (let i = 0; i < this.permissionService.reportDist.length; i++) {
        if (this.permissionService.reportDist[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.reportDist[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.reportDist[i].value === 0) {
          this.isCreate = true;
        }
      }
    }
  }

  detailRouter(id: string) {
    this.filterReport.currentDate = this.currentDateforDist;
    this.filterReport.currentMode = 1;
    window.localStorage.setItem('filterReport', JSON.stringify(this.filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: { id: id }
    });
  }

  loadData() {

    this.service.getAll().subscribe(distributorReports => {
      this.theaterService.getAll().subscribe(theaters => {
        this.theaters = theaters.filter(item => item.distId === this.currentUser.distId);
        this.theaterReportService.getAll().subscribe(theaterReports => {

          if (this.currentDateforDist) {
            this.distributorReports = distributorReports.filter(r => (r.distId === this.currentUser.distId) &&
              new Date(r.date).getMonth() === new Date(this.currentDateforDist).getMonth() &&
              new Date(r.date).getFullYear() === new Date(this.currentDateforDist).getFullYear());
          } else {
            this.distributorReports = distributorReports.filter(r => (r.distId === this.currentUser.distId));
          }
          this.finalReports = [];

          for (let a = 0; a < this.distributorReports.length; a++) {

            this.theaterReport = new TheaterReportModel();
            this.currentTheater = new TheaterModel();
            this.tempReports = [];
            this.reports = [];

            this.tempReports = theaterReports.filter(item =>
              this.distributorReports[a].theaterReports.some(th =>
                item._id === th.theaterReportsId));

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
          });          this.setPage(1);
        });
      });
    })
  }

  deleteReport(id: any) {
    if (confirm(`Вы уверены, что хотите удалить отчёта?`)) {
      this.service.delete(id).subscribe(res => this.loadData());
    }
  }
  sendReport(id: any) {
    this.distributorReport._id = id;
    this.distributorReport.sent = true;
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
