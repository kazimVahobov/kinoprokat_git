import {Component, OnInit} from '@angular/core';
import {
  TheaterReportService,
  DistributorService,
  TheaterService,
  TheaterReportModel,
  DistributorModel,
  TheaterModel,
  PagerService, DistributorReportService
} from 'src/app/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {combineLatest} from "rxjs";
import {map} from "rxjs/operators";

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

  distributors: DistributorModel[];
  theaters: TheaterModel[];

  constructor(private thReportService: TheaterReportService,
              private distReportService: DistributorReportService,
              private distService: DistributorService,
              private theaterService: TheaterService,
              private router: Router,
              private pagerService: PagerService,
              private location: Location) {
  }

  ngOnInit() {
    this.distributors = [];
    this.theaters = [];
    this.getReports();
  }

  backPage() {
    this.location.back();
  }

  getReports() {
    combineLatest(
      this.thReportService.getByFilter(true, false),
      this.distReportService.getByFilter(true, false),
      this.theaterService.getAll(),
      this.distService.getAll()
    ).pipe(
      map(([_thReports, _distReports, _theaters, _distributors]) => {
        this.theaters = _theaters;
        this.distributors = _distributors;
        let result: any[] = [];

        result.push(...this.getReportsForView(_thReports, true));
        result.push(...this.getReportsForView(_distReports, false));
        result.sort((a, b) => {
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
        return result;
      })
    ).subscribe(data => this.setPage(1, data));
  }

  getReportsForView(array: any[], isTheater: boolean): any[] {
    let idType = isTheater ? 'theaterId' : 'distId';
    let subItem = isTheater ? 'withCont' : 'mobileTheaters';
    return array.map(item => {
      let _ticketCount: number = 0;
      let _sum: number = 0;
      item[subItem].forEach(session => {
        _ticketCount += session.childTicketCount + session.adultTicketCount;
        _sum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
      });
      return {
        _id: item._id,
        date: item.date,
        isTheater: isTheater,
        [idType]: item[idType],
        sessionCount: item[subItem].length,
        ticketCount: _ticketCount,
        sum: _sum,
        sent: item.sent,
        confirm: item.confirm
      }
    });

  }

  confirmReport(id: any, isTheater: boolean) {
    if (confirm(`Вы уверены, что хотите подтвердить отчёт?`)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = true;
      reportToConfirm.confirm = true;
      if (isTheater) {
        this.thReportService.update(reportToConfirm).subscribe(report => {
            this.getReports();
          },
          error => {
            alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
          });
      } else {
        this.distReportService.update(reportToConfirm).subscribe(report => {
            this.getReports();
          },
          error => {
            alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
          });
      }

    }
  }

  cancelReport(id: any, isTheater: boolean) {
    if (confirm(`Вы уверены, что хотите отменить отчёт?`)) {
      let reportToCancel: any = {};
      reportToCancel._id = id;
      reportToCancel.sent = false;
      reportToCancel.confirm = false;
      if (isTheater) {
        this.thReportService.update(reportToCancel).subscribe(report => {
            this.getReports();
          },
          error => {
            alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
          });
      } else {
        this.distReportService.update(reportToCancel).subscribe(report => {
            this.getReports();
          },
          error => {
            alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
          });
      }

    }
  }

  detailRouter(id: string, isTheater: boolean) {
    let type = isTheater ? 'theater' : 'dist';
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: type}
    });
  }

  setPage(page: number, data: any[]) {
    // get pager object from service
    this.pager = this.pagerService.getPager(data.length, page);
    // get current page of items
    this.pagedItems = [];
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
