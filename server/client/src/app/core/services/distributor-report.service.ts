import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {DistributorReportModel} from '../models';
import {Observable} from "rxjs";

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
}
