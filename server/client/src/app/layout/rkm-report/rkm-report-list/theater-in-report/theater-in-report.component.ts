import {Component, OnInit, Input} from '@angular/core';
import {
  TheaterReportService,
  TheaterService,
  TheaterReportModel,
  TheaterModel,
  PagerService,
  PermissionService, DistributorService, DistributorModel
} from 'src/app/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-theater-in-report',
  templateUrl: './theater-in-report.component.html',
  styleUrls: ['./theater-in-report.component.scss']
})
export class TheaterInReportComponent implements OnInit {

  @Input() currentDate: string;

  theaters: TheaterModel[];
  distributors: DistributorModel[];
  reports: Report[];

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  currentUser = JSON.parse(localStorage.getItem('user'));
  isConfirm = false;

  constructor(private service: TheaterReportService,
              private theaterService: TheaterService,
              private distributorService: DistributorService,
              private pagerService: PagerService,
              private router: Router,
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

  loadData() {
    this.theaters = [];
    this.distributors = [];
    this.reports = [];

    this.distributorService.getAll().subscribe(distributors => {
      this.distributors = distributors;
      this.theaterService.getAll().subscribe(theaters => {
        this.theaters = theaters;
        this.service.getAll().subscribe(reports => {
          let tempReports: TheaterReportModel[] = [];
          if (this.currentDate) {
            tempReports = reports.filter(item =>
              item.sent === true && new Date(item.date).toDateString() === new Date(this.currentDate).toDateString());
          } else {
            tempReports = reports.filter(item => item.sent === true);
          }
          this.service.prepareReportsToView(tempReports).subscribe(data => {
            this.reports = data;
            this.setPage(1);
          });
        });
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

  detailRouter(id: string) {
    let filterReport: any = {};
    filterReport.currentDate = this.currentDate;
    filterReport.currentMode = 1;
    window.localStorage.setItem('filterReport', JSON.stringify(filterReport));
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: 'theater'}
    });
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
  distId: string;
  sessionCount: number;
  ticketCount: number;
  sum: number;
  sent: boolean;
  confirm: boolean;
  withoutCont: boolean;
}
