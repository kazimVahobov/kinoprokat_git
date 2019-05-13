import {Component, OnInit, Input} from '@angular/core';
import {
  TheaterReportService,
  TheaterService,
  TheaterReportModel,
  TheaterModel,
  PagerService,
  PermissionService
} from 'src/app/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-in-report',
  templateUrl: './in-report.component.html',
  styleUrls: ['./in-report.component.scss']
})
export class InReportComponent implements OnInit {

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

  isConfirm = false;

  filterReport: any = {};

  constructor(private service: TheaterReportService,
              private theaterService: TheaterService,
              private pagerService: PagerService,
              private router: Router,
              private permissionService: PermissionService
  ) {
  }

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {

    if (this.permissionService.reportDist) {
      for (let i = 0; i < this.permissionService.reportDist.length; i++) {
        if (this.permissionService.reportDist[i].value === 4) {
          this.isConfirm = true;
        }
      }
    }

  }

  detailRouter(id: string) {
    this.filterReport.currentDate = this.currentDate;
    this.filterReport.currentMode = 0;
    window.localStorage.setItem('filterReport', JSON.stringify(this.filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id}
    });
  }

  loadData() {
    this.theaterReport = new TheaterReportModel();
    this.currentTheater = new TheaterModel();
    this.tempReports = [];
    this.theaters = [];

    this.theaterService.getAll().subscribe(theaters => {
      this.theaters = theaters.filter(item => item.distId === this.currentUser.distId);
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
          this.tempReport.theaterId = this.tempReports[i].theaterId;
          this.tempReport.ticketCount = 0;
          this.tempReport.summ = 0;
          this.tempReport._id = this.tempReports[i]._id;
          this.tempReport.date = this.tempReports[i].date;
          this.tempReport.sent = this.tempReports[i].sent;
          this.tempReport.confirm = this.tempReports[i].confirm;
          this.tempReport.sessionCount = this.tempReports[i].withCont.length;
          this.tempReport.withoutCont = !this.tempReports[i].withoutCont;

          for (let j = 0; j < this.tempReports[i].withCont.length; j++) {
            if (!this.tempReport.movies.some(item => item === this.tempReports[i].withCont[j].movieId)) {
              this.tempReport.movies.push(this.tempReports[i].withCont[j].movieId);
            }
            this.tempReport.ticketCount += this.tempReports[i].withCont[j].childTicketCount + this.tempReports[i].withCont[j].adultTicketCount;
            this.tempReport.summ += (this.tempReports[i].withCont[j].childTicketCount * this.tempReports[i].withCont[j].childTicketPrice) +
              (this.tempReports[i].withCont[j].adultTicketCount * this.tempReports[i].withCont[j].adultTicketPrice);
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
