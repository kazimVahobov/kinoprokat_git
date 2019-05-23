import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {DistributorReportModel} from '../models';
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DistributorReportService extends EntityService<DistributorReportModel> {

  constructor(http: HttpClient) {
    super('distributor-report', http);
  }

  getByFilter(sent: boolean, confirm: boolean): Observable<DistributorReportModel[]> {
    const url = `${this.baseUrl}/getByFilter`;
    return this.http.put<DistributorReportModel[]>(url, {
      sent: sent,
      confirm: confirm
    });
  }

  getByDistId(id: string): Observable<any[]> {
    const url = `${this.baseUrl}/by-dist/${id}`;
    return this.http.get<any[]>(url);
  }

  getOneReportByDate(distId: string, date: Date): Observable<DistributorReportModel> {
    return combineLatest(
      this.getByDistId(distId)
    ).pipe(
      map(([_distReports]) => {
        let report = _distReports.find(item => new Date(item.date).toDateString() === date.toDateString());
        return report ? report : null;
      })
    );
  }

  getReportsByDate(date: Date, distId?: string): Observable<any[]> {
    let combineRequests;
    if (distId) {
      combineRequests = combineLatest(this.getByDistId(distId))
    } else {
      combineRequests = combineLatest(this.getAll())
    }
    return combineRequests.pipe(
      map(([_distReports]) => {
        if (_distReports.length != 0) {
          return _distReports.filter(_report => new Date(_report.date).toDateString() === date.toDateString()).filter(_report => _report.sent);
        } else {
          return [];
        }
      })
    );
  }

  prepareReportsToView(reports: DistributorReportModel[]): any[] {
    let result: any[] = [];
    reports.forEach(item => {
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
      result.push({
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
  }
}
