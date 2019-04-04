import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;
  currentUserId;
  expireTime;
  token;

  constructor() {
    const auth = JSON.parse(localStorage.getItem('authData'));
    if (auth) {
      this.isAuthenticated = true;
      this.currentUserId = auth.userId;
      this.expireTime = auth.expireTime;
      this.token = auth.token;
    }
  }

  getHeader() {
    let headers = new HttpHeaders();
    headers = headers.append('token', this.getToken());
    headers = headers.append('Content-Type', 'application/json; charset=UTF-8');
    return headers;
  }

  getToken(): string {
    return this.token;
  }

  clearToken() {
    localStorage.removeItem('authData');
    this.isAuthenticated = false;
    this.currentUserId = null;
    this.token = null;
  }

  setAuthData(auth) {
    this.token = auth.token;
    this.isAuthenticated = true;
    this.currentUserId = auth.userId;
    this.expireTime = auth.expireTime;
    localStorage.setItem('authData', JSON.stringify(auth));
  }

  isTokenExpired(): boolean {
    let token = this.getToken();
    if (!token) return true;
    if (this.expireTime === undefined) return false;
    return this.expireTime <= new Date().valueOf();
  }

}
