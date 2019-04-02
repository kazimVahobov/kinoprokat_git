import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {DistributorReportModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DistributorReportService extends EntityService<DistributorReportModel> {

  constructor(http: HttpClient) {
    super('distributor-report', http);
  }
}
