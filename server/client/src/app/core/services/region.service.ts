import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityService} from './base';
import {RegionModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class RegionService extends EntityService<RegionModel> {

  constructor(http: HttpClient) {
    super('region', http);
  }
}
