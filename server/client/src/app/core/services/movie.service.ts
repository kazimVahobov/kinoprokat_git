import { Injectable } from '@angular/core';
import { EntityService } from './base';
import { HttpClient } from '@angular/common/http';
import { MovieModel } from '../models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MovieService extends EntityService<MovieModel> {

  constructor(http: HttpClient) {
    super('movie', http);
  }
  deleteAllData(model: any): Observable<any> {
    const url = `${this.baseUrl}/delete`;
    return this.http.post<any>(url, model);
  }

  createMovie(model: MovieModel): Observable<MovieModel> {
    let formData = new FormData();
    formData.append('file', model.file);
    formData.append('application', JSON.stringify(model));
    if (model._id) {
      const url = `${this.baseUrl}/${model._id}`;
      return this.http.put<MovieModel>(url, formData);
    } else {
      return this.http.post<MovieModel>(this.baseUrl, formData);
    }
  }
}