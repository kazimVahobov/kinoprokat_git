import {Injectable} from '@angular/core';
import {EntityService} from './base';
import {HttpClient} from '@angular/common/http';
import {TheaterReportModel} from '../models';
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TheaterService} from "./theater.service";


@Injectable({
  providedIn: 'root'
})
export class TheaterReportService extends EntityService<TheaterReportModel> {

  constructor(http: HttpClient, private theaterService: TheaterService) {
    super('theater-report', http);
  }

  getByFilter(sent: boolean, confirm: boolean): Observable<TheaterReportModel[]> {
    const url = `${this.baseUrl}/getByFilter`;
    return this.http.put<TheaterReportModel[]>(url, {
      sent: sent,
      confirm: confirm
    });
  }

  getByTheaterId(id: string): Observable<any[]> {
    const url = `${this.baseUrl}/by-theater/${id}`;
    return this.http.get<any[]>(url);
  }

  getOneReportByDate(theaterId: string, date: Date): Observable<TheaterReportModel> {
    return combineLatest(
      this.getByTheaterId(theaterId)
    ).pipe(
      map(([_thReports]) => {
        let report = _thReports.find(item => new Date(item.date).toDateString() === date.toDateString());
        return report ? report : null;
      })
    );
  }

  getReportsByDate(date: Date, theaterId?: string): Observable<any[]> {
    let combineRequests;
    if (theaterId) {
      combineRequests = combineLatest(this.getByTheaterId(theaterId))
    } else {
      combineRequests = combineLatest(this.getAll())
    }
    return combineRequests.pipe(
      map(([_thReports]) => {
        if (_thReports.length != 0) {
          return _thReports.filter(_report => new Date(_report.date).toDateString() === date.toDateString()).filter(_report => _report.sent);
        } else {
          return [];
        }
      })
    );
  }

  prepareReportsToView(reports: TheaterReportModel[]): Observable<any[]> {

    return this.theaterService.getAll().pipe(
      map(theaters => {
        let result: any[] = [];
        reports.forEach(tempReport => {
          let _ticketCount: number = 0;
          let _sum: number = 0;
          tempReport.withCont.forEach(session => {
            _ticketCount += session.childTicketCount + session.adultTicketCount;
            _sum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
          });
          let _withoutCont: boolean = tempReport.withoutCont.length == 0;
          let _distId = theaters.find(th => th._id === tempReport.theaterId).distId;
          result.push({
            _id: tempReport._id,
            date: tempReport.date,
            theaterId: tempReport.theaterId,
            distId: _distId,
            sessionCount: tempReport.withCont.length,
            ticketCount: _ticketCount,
            sum: _sum,
            sent: tempReport.sent,
            confirm: tempReport.confirm,
            withoutCont: _withoutCont
          });
        });
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
      }));
  }

}
