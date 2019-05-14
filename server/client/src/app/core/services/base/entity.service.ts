import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export abstract class EntityService<T> {

  baseUrl: string;

  constructor(protected controller: string, protected http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}/api/${controller}`;
  }

  /** GET all entities from the server */
  getAll(): Observable<T[]> {
    const url = `${this.baseUrl}`;
    return this.http.get<T[]>(url)
      .pipe(
        map(_ => _),
      );
  }

  /** GET by id. Will 404 if id not found */
  getById(id: string): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url).pipe(
      map(_ => _),
      catchError(this.handleError<T>(`getById id=${id}`))
    );
  }

  /** POST: add a new entity to the server */
  create(model: T): Observable<T> {
    const url = `${this.baseUrl}`;
    return this.http.post<T>(url, model, httpOptions)
      .pipe(
        map(_ => _)
      );
  }


  /** PUT: update on the server */
  update(model: T): Observable<T> {
    const url = `${this.baseUrl}/${model['_id']}`;
    return this.http.put<T>(url, model, httpOptions)
      .pipe(
        map(_ => _)
      );
  }

  save(model: T): Observable<T> {
    if (model['_id']) {
      return this.update(model);
    } else {
      return this.create(model);
    }
  }

  // /** DELETE: delete from the server */
  // delete(models: T | T[]): Observable<T | T[]> {

  //     return this.http.request<T | T[]>('delete', this.baseUrl, { body: models, headers: httpOptions.headers }).pipe(
  //         tap(_ => this.log(`deleted`)),
  //         catchError(this.handleError<T | T[]>('delete'))
  //     );
  // }


  /** DELETE: delete from the server */
  delete(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url, httpOptions);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<E>(operation = 'operation', result?: E) {
    return (error: any): Observable<E> => {

      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as E);
    };
  }

  /** Log a Service message with the MessageService */
  protected log(message: string) {
    // this.messageService.add('Service: ' + message);
    // console.log(`${this.controller} ${message}`);
  }

  public formatErrors(errors: any) {
    return errors ? errors.map((err: any) => err.message).join('/n') : '';
  }

}
