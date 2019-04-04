import { Component, OnInit } from '@angular/core';
import {
  PagerService,
  TheaterReportService,
  TheaterReportModel,
  PermissionService
} from 'src/app/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { BsDatepickerViewMode } from "ngx-bootstrap/datepicker/models";
import { Router } from '@angular/router';

@Component({
  selector: 'app-theater-report-list',
  templateUrl: './theater-report-list.component.html',
  styleUrls: ['./theater-report-list.component.scss']
})
export class TheaterReportListComponent implements OnInit {

  tempReports: TheaterReportModel[] = [];
  reports: Report[];
  tempReport: Report;

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  currentUser = JSON.parse(localStorage.getItem('user'));

  currentDate: Date = null;

  minMode: BsDatepickerViewMode;

  bsConfig: Partial<BsDatepickerConfig>;

  isDelete = false;
  isEdit = false;
  isCreate = false;

  constructor(
    private service: TheaterReportService,
    private pagerService: PagerService,
    private router: Router,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {

    this.minMode = 'month'
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'MM/YYYY',
      minMode: this.minMode
    });

    this.load();

    if (this.permissionService.reportTheater) {
      for (let i = 0; i < this.permissionService.reportTheater.length; i++) {
        if (this.permissionService.reportTheater[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.reportTheater[i].value === 0) {
          this.isCreate = true;
        }
        if (this.permissionService.reportTheater[i].value === 3) {
          this.isDelete = true;
        }
      }
    }
  }

  detailRouter(id: string) {
    this.router.navigate(['/detail-report'], { queryParams: { id: id, currentMode: 0 } });
  }

  load() {
    this.reports = [];
    this.service.getAll().subscribe(reports => {
      if (this.currentDate) {
        this.tempReports = reports.filter(
          item => item.theaterId === this.currentUser.theaterId &&
            new Date(item.date).getMonth() === new Date(this.currentDate).getMonth() &&
            new Date(item.date).getFullYear() === new Date(this.currentDate).getFullYear());
      } else {
        this.tempReports = reports.filter(
          item => item.theaterId === this.currentUser.theaterId);
      }
      for (let i = 0; i < this.tempReports.length; i++) {
        this.tempReport = new Report();
        this.tempReport.movies = [];
        this.tempReport.ticketCount = 0;
        this.tempReport.summ = 0;
        this.tempReport.withoutCont = false;
        this.tempReport._id = this.tempReports[i]._id;
        this.tempReport.date = this.tempReports[i].date;
        this.tempReport.sent = this.tempReports[i].sent;
        this.tempReport.confirm = this.tempReports[i].confirm;
        this.tempReport.sessionCount = this.tempReports[i].withCont.length;

        if (this.tempReports[i].withoutCont.length != 0) {
          this.tempReport.withoutCont = true;
        }

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
  }

  clearDatapicker() {
    this.currentDate = null;
    this.load();
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.reports.length, page);

    // get current page of items
    this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  deleteReport(report: Report) {
    if (confirm(`Вы действительно хотите удалить отчёт за ${new Date(report.date).getDate()}.${new Date(report.date).getMonth() + 1}.${new Date(report.date).getFullYear()}?`)) {
      this.service.delete(report._id).subscribe(() => {
        alert('Отчёт успешно удалён');
        this.load();
      },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

  sendReport(report: Report) {
    if (confirm(`Вы действительно хотите отправить отчёт за ${new Date(report.date).getDate()}.${new Date(report.date).getMonth() + 1}.${new Date(report.date).getFullYear()}?`)) {
      let model: TheaterReportModel = new TheaterReportModel();
      model._id = report._id;
      model.sent = true;
      this.service.update(model).subscribe(() => {
        alert('Отчёт успешно отправлен');
        this.load();
      },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

}

class Report {
  _id: string;
  date: Date;
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  withoutCont: boolean;
  summ: number;
  sent: boolean;
  confirm: boolean;
}
