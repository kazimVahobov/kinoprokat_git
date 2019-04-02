import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {DistributorModel} from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistributorService extends EntityService<DistributorModel> {

  constructor(http: HttpClient) {
    super('distributor', http);
  }
  deleteAllData(model: any): Observable<any> {
    const url = `${this.baseUrl}/delete`;
    return this.http.post<any>(url, model);
  }

}
