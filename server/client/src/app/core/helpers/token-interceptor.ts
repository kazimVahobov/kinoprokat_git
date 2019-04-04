import {Injectable, Injector} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import {Router} from '@angular/router';

import {AuthService} from '../services';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

const AUTH_PREFIX = '';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, public router: Router, private inj: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Authorization': `${AUTH_PREFIX}${this.auth.getToken()}`
      }
    });
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else if (err.status === 403) {
            this.router.navigate(['/forbidden']);
          } else if (err.status === 400) {
            throw err;
          }
        }
        throw err;
      })
    );
  }

  private formatErrors(err: any) {
    if (typeof err.error === 'string') {
      err.error = JSON.parse(err.error);
    }
    if (err.error.errors) {
      return err.error.errors.map((err: any) => err.message);
    }
    if (err.errors) {
      return err.errors.map((err: any) => err.message);
    }
    if (err.error) {
      return [err.error.message];
    }
    if (err.message) {
      return [err.message];
    }
    return ['Something went wrong'];
  }
}
