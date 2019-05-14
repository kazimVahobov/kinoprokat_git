import { Injectable } from '@angular/core';
import { EntityService } from './base';
import { HttpClient } from '@angular/common/http';
import {TheaterModel } from '../models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TheaterService extends EntityService<TheaterModel> {

  constructor(http: HttpClient) {
    super('theater', http);
  }
  deleteAllData(model: any): Observable<any> {
    const url = `${this.baseUrl}/delete`;
    return this.http.post<any>(url, model);
  }

  getByRegionId(id: string): Observable<any[]> {
    const url = `${this.baseUrl}/by-region/${id}`;
    return this.http.get<any[]>(url);
  }

}
