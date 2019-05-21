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
        this.reports = this.service.prepareReportsToView(tempReports);
        this.setPage(1);
      });
    });
  }

  actionReport(id: any, state: boolean) {
    let message = state ? 'Вы уверены, что хотите подтвердить отчёт?' : 'Вы уверены, что хотите отменить отчёт?';
    if (confirm(message)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = state;
      reportToConfirm.confirm = state;
      this.service.update(reportToConfirm).subscribe(report => {
          // this.loadData();
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
