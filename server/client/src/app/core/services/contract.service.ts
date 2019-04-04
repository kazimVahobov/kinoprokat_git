import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {ContractModel} from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService extends EntityService<ContractModel> {

  constructor(http: HttpClient) {
    super('contract', http);
  }
  deleteAllData(model: any): Observable<any> {
    const url = `${this.baseUrl}/delete`;
    return this.http.post<any>(url, model);
  }
}
