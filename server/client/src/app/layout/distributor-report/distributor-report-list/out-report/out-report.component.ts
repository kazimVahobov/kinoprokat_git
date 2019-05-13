import {Component, Input, OnInit} from '@angular/core';
import {DistributorReportModel, DistributorReportService, PagerService, PermissionService} from 'src/app/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-out-report',
  templateUrl: './out-report.component.html',
  styleUrls: ['./out-report.component.scss']
})
export class OutReportComponent implements OnInit {

  @Input() currentDateForDist: string = null;

  reports: Report[];

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];

  currentUser = JSON.parse(localStorage.getItem('user'));

  isDelete = false;
  isEdit = false;
  isCreate = false;

  constructor(private pagerService: PagerService,
              private service: DistributorReportService,
              private router: Router,
              private permissionService: PermissionService) {
  }

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {
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

  loadData() {
    this.reports = [];
    this.service.getAll().subscribe(distributorReports => {
      let tempReports: DistributorReportModel[] = [];
      if (this.currentDateForDist) {
        tempReports = distributorReports.filter(r => (r.distId === this.currentUser.distId) &&
          new Date(r.date).getMonth() === new Date(this.currentDateForDist).getMonth() &&
          new Date(r.date).getFullYear() === new Date(this.currentDateForDist).getFullYear());
      } else if (this.currentDateForDist == null) {
        tempReports = distributorReports.filter(r => (r.distId === this.currentUser.distId));
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
    })
  }

  deleteReport(id: any) {
    if (confirm(`Вы уверены, что хотите удалить отчёта?`)) {
      this.service.delete(id).subscribe(res => this.loadData());
    }
  }

  sendReport(id: any) {
    let reportToSend: any = {};
    reportToSend._id = id;
    reportToSend.sent = true;
    this.service.update(reportToSend).subscribe(report => {
        this.loadData();
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  detailRouter(id: string) {
    let filterReport: any = {};
    filterReport.currentDate = this.currentDateForDist;
    filterReport.currentMode = 1;
    window.localStorage.setItem('filterReport', JSON.stringify(filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id}
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.reports.length, page);
    this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}


class Report {
  _id: string;
  date: Date;
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  sum: number;
  sent: boolean;
  confirm: boolean;
}
