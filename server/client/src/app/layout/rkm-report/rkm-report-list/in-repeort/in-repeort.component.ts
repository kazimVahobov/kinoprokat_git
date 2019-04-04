import { Component, OnInit, Input } from '@angular/core';
import { TheaterReportService, TheaterService, TheaterReportModel, TheaterModel, PagerService, PermissionService } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-detail-repeort',
  templateUrl: './in-repeort.component.html',
  styleUrls: ['./in-repeort.component.scss']
})
export class InRepeortComponent implements OnInit {

  @Input() currentDate: string;

  tempReports: TheaterReportModel[];
  theaterReport: TheaterReportModel;
  theaters: TheaterModel[];
  currentTheater: TheaterModel;

  reports: Report[];
  tempReport: Report;

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  currentUser = JSON.parse(localStorage.getItem('user'));
  filterReport: any = {};
  isConfirm = false;

  constructor(private service: TheaterReportService,
    private theaterService: TheaterService,
    private pagerService: PagerService,
    private router: Router,
    private permissionService: PermissionService
  ) {
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadData();

    if (this.permissionService.reportRKM) {
      for (let i = 0; i < this.permissionService.reportRKM.length; i++) {
        if (this.permissionService.reportRKM[i].value === 4) {
          this.isConfirm = true;
        }
      }
    }

  }

  loadData() {
    this.theaterReport = new TheaterReportModel();
    this.currentTheater = new TheaterModel();
    this.tempReports = [];
    this.theaters = [];

    this.theaterService.getAll().subscribe(theaters => {
      if (this.currentUser.distId) {
        this.theaters = theaters.filter(item => item.distId === this.currentUser.distId);
      } else {
        this.theaters = theaters;
      }
      this.service.getAll().subscribe(reports => {

        if (this.currentDate) {
          this.tempReports = reports.filter(item =>
            this.theaters.some(th => item.theaterId === th._id) &&
            item.sent === true && new Date(item.date).toDateString() === new Date(this.currentDate).toDateString());
        } else {
          this.tempReports = reports.filter(item =>
            this.theaters.some(th => item.theaterId === th._id) &&
            item.sent === true);
        }
        this.reports = [];

        for (let i = 0; i < this.tempReports.length; i++) {
          this.tempReport = new Report();
          this.tempReport.movies = [];
          this.tempReport.theaterId = this.tempReports[i].theaterId
          this.tempReport.ticketCount = 0;
          this.tempReport.summ = 0;
          this.tempReport._id = this.tempReports[i]._id;
          this.tempReport.date = this.tempReports[i].date;
          this.tempReport.sent = this.tempReports[i].sent;
          this.tempReport.confirm = this.tempReports[i].confirm;
          this.tempReport.sessionCount = this.tempReports[i].withCont.length;
          this.tempReport.withoutCont = !this.tempReports[i].withoutCont

          for (let j = 0; j < this.tempReports[i].withCont.length; j++) {
            if (!this.tempReport.movies.some(item => item === this.tempReports[i].withCont[j].movieId)) {
              this.tempReport.movies.push(this.tempReports[i].withCont[j].movieId);
            }
            this.tempReport.ticketCount += this.tempReports[i].withCont[j].ticketCount;
            this.tempReport.summ += this.tempReports[i].withCont[j].ticketCount * this.tempReports[i].withCont[j].price;
          }
          this.reports.push(this.tempReport);
        }
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
        this.setPage(1);
      });
    });
  }

  confirmReport(id: any) {
    this.theaterReport._id = id;
    this.theaterReport.sent = true;
    this.theaterReport.confirm = true;
    this.service.update(this.theaterReport).subscribe(report => {
      this.loadData();
    },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  detailRouter(id: string) {
    this.filterReport.currentDate = this.currentDate;
    this.filterReport.currentMode = 1;
    window.localStorage.setItem('filterReport', JSON.stringify(this.filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: { id: id }
    });
  }

  cancelReport(id: any) {
    this.theaterReport._id = id;
    this.theaterReport.sent = false;
    this.theaterReport.confirm = false;
    this.service.update(this.theaterReport).subscribe(report => {
      this.loadData();
    },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.reports.length, page);
    // get current page of items
    this.pagedItems = [];
    this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}

class Report {
  _id: string;
  date: Date;
  theaterId: string;
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  summ: number;
  sent: boolean;
  confirm: boolean;
  withoutCont: boolean;
}