import {Component, OnInit} from '@angular/core';
import {
  TheaterReportService,
  DistributorService,
  TheaterService,
  TheaterReportModel,
  DistributorModel,
  TheaterModel,
  PagerService
} from 'src/app/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-unconfirmed-reports',
  templateUrl: './unconfirmed-reports.component.html',
  styleUrls: ['./unconfirmed-reports.component.scss']
})
export class UnconfirmedReportsComponent implements OnInit {

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  unconfirmedReports: TheaterReportModel[];
  distributors: DistributorModel[];
  theaters: TheaterModel[];

  reports: Report[];
  tempReport: Report;

  constructor(private service: TheaterReportService,
              private distService: DistributorService,
              private theaterService: TheaterService,
              private router: Router,
              private pagerService: PagerService,
              private location: Location) {
  }

  ngOnInit() {
    this.unconfirmedReports = [];
    this.distributors = [];
    this.theaters = [];
    this.getUnconfirmedReports();
  }

  backPage() {
    this.location.back();
  }

  getUnconfirmedReports() {
    this.reports = [];
    this.service.getAll().subscribe(theaterReports => {
      this.distService.getAll().subscribe(distributors => {
        this.theaterService.getAll().subscribe(theaters => {
          this.unconfirmedReports = theaterReports.filter(r => r.sent === true && r.confirm === false);

          this.distributors = distributors;
          this.theaters = theaters;

          for (let i = 0; i < this.unconfirmedReports.length; i++) {
            this.tempReport = new Report();
            this.tempReport.theaterId = this.unconfirmedReports[i].theaterId
            this.tempReport.distId = this.theaters.find(th => th._id === this.unconfirmedReports[i].theaterId).distId
            this.tempReport.ticketCount = 0;
            this.tempReport.sum = 0;
            this.tempReport._id = this.unconfirmedReports[i]._id;
            this.tempReport.date = this.unconfirmedReports[i].date;
            this.tempReport.sent = this.unconfirmedReports[i].sent;
            this.tempReport.confirm = this.unconfirmedReports[i].confirm;
            this.tempReport.sessionCount = this.unconfirmedReports[i].withCont.length;
            this.tempReport.withoutCont = !this.unconfirmedReports[i].withoutCont

            for (let j = 0; j < this.unconfirmedReports[i].withCont.length; j++) {
              this.tempReport.ticketCount += this.unconfirmedReports[i].withCont[j].childTicketCount + this.unconfirmedReports[i].withCont[j].adultTicketCount;
              this.tempReport.sum += (this.unconfirmedReports[i].withCont[j].childTicketCount * this.unconfirmedReports[i].withCont[j].childTicketPrice) +
                (this.unconfirmedReports[i].withCont[j].adultTicketCount * this.unconfirmedReports[i].withCont[j].adultTicketPrice);
            }
            this.reports.push(this.tempReport);
          }
          this.reports = this.reports.reverse();


          this.setPage(1);
        })
      })
    })
  }

  confirmReport(id: any) {
    if (confirm(`Вы уверены, что хотите подтвердить отчёт?`)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = true;
      reportToConfirm.confirm = true;
      this.service.update(reportToConfirm).subscribe(report => {
          this.getUnconfirmedReports();
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
          this.getUnconfirmedReports();
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

  detailRouter(id: string) {
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: 'theater'}
    });
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
