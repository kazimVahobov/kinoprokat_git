import {Injectable} from '@angular/core';
import {EntityService} from './base';
import {HttpClient} from '@angular/common/http';
import {TheaterReportModel} from '../models';


@Injectable({
  providedIn: 'root'
})
export class TheaterReportService extends EntityService<TheaterReportModel> {

  constructor(http: HttpClient) {
    super('theater-report', http);
  }


}
