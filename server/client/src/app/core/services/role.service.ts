import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {RoleModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends EntityService<RoleModel> {

  constructor(http: HttpClient) {
    super('role', http);
  }
}
