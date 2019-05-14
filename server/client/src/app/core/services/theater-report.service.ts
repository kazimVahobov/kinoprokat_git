import {Injectable} from '@angular/core';
import {EntityService} from './base';
import {HttpClient} from '@angular/common/http';
import {TheaterReportModel} from '../models';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TheaterReportService extends EntityService<TheaterReportModel> {

  constructor(http: HttpClient) {
    super('theater-report', http);
  }

  filter(sent: boolean, confirm: boolean): Observable<TheaterReportModel[]> {
    const url = `${this.baseUrl}/filter`;
    return this.http.put<TheaterReportModel[]>(url, {
      sent: sent,
      confirm: confirm
    });
  }

}
