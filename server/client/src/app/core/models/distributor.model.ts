import {BaseModel} from './base.model';

export class DistributorModel extends BaseModel {
  _id: string;
  name: string;
  regionId: string;
  address: string;
  parentId?: string;
  phone: string;
  email: string;
  directorId: string;
  canDelete?: boolean = true;
}
