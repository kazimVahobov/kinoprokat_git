import {Injectable} from '@angular/core';
import {EntityService} from './base';
import {HttpClient} from '@angular/common/http';
import {TheaterReportModel} from '../models';
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class TheaterReportService extends EntityService<TheaterReportModel> {

  constructor(http: HttpClient) {
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

  getReportByDate(theaterId: string, date: Date): Observable<TheaterReportModel> {
    return combineLatest(
      this.getByTheaterId(theaterId)
    ).pipe(
      map(([_thReports]) => {
        let report = _thReports.find(item => new Date(item.date).toDateString() === date.toDateString());
        return report ? report : null;
      })
    );
  }

}
