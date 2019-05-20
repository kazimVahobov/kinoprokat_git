import {Component, OnInit, Input} from '@angular/core';
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
import {Router} from '@angular/router';

@Component({
  selector: 'app-dist-in-report',
  templateUrl: './dist-in-report.component.html',
  styleUrls: ['./dist-in-report.component.scss']
})
export class DistInReportComponent implements OnInit {

  @Input() currentDateForDist: string;
  reports: Report[];
  distributors: DistributorModel[];

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];

  currentUser = JSON.parse(localStorage.getItem('user'));
  isConfirm = false;

  constructor(private pagerService: PagerService,
              private service: DistributorReportService,
              private theaterReportService: TheaterReportService,
              private theaterService: TheaterService,
              private router: Router,
              private distributorService: DistributorService,
              private permissionService: PermissionService
  ) {
  }

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {
    if (this.permissionService.reportRKM) {
      for (let i = 0; i < this.permissionService.reportRKM.length; i++) {
        if (this.permissionService.reportRKM[i].value === 4) {
          this.isConfirm = true;
        }
      }
    }

  }

  detailRouter(id: string) {
    let filterReport: any = {};
    filterReport.currentDate = this.currentDateForDist;
    filterReport.currentMode = 0;
    window.localStorage.setItem('filterReport', JSON.stringify(filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: 'dist'}
    });
  }

  loadData() {
    this.reports = [];
    this.distributors = [];
    this.distributorService.getAll().subscribe(distributors => {
      this.distributors = distributors;
      this.service.getAll().subscribe(distributorReports => {
        let tempReports: DistributorReportModel[] = [];
        if (this.currentDateForDist) {
          tempReports = distributorReports.filter(r => (r.sent === true) &&
            new Date(r.date).toDateString() === new Date(this.currentDateForDist).toDateString());
        } else {
          tempReports = distributorReports.filter(r => (r.sent === true));
        }

        tempReports.forEach(item => {
          let _movies: string[] = [];
          let _ticketCount: number = 0;
          let _sum: number = 0;
          item.mobileTheaters.forEach(session => {
            if (!_movies.some(i => i === session.movieId)) {
              _movies.push(session.movieId);
            }
            _ticketCount += (session.childTicketCount + session.adultTicketCount);
            _sum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
          });
          this.reports.push({
            _id: item._id,
            distId: item.distId,
            date: item.date,
            movies: _movies,
            sessionCount: item.mobileTheaters.length,
            ticketCount: _ticketCount,
            sum: _sum,
            sent: item.sent,
            confirm: item.confirm
          });
        });
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
    if (confirm(`Вы уверены, что хотите подтвердить отчёт?`)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = true;
      reportToConfirm.confirm = true;
      this.service.update(reportToConfirm).subscribe(report => {
          this.loadData();
        },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

  cancelReport(id: any) {
    if (confirm(`Вы уверены, что хотите отменить отчёт?`)) {
      let reportToCancel: any = {};
      reportToCancel._id = id;
      reportToCancel.sent = false;
      reportToCancel.confirm = false;
      this.service.update(reportToCancel).subscribe(report => {
          this.loadData();
        },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.reports.length, page);
    this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}


class Report {
  _id: string;
  distId: string;
  date: Date;
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  sum: number;
  sent: boolean;
  confirm: boolean;
}
