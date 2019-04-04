import {BaseModel} from './base.model';

export class TheaterModel extends BaseModel {
  _id: string;
  distId: string;
  name: string;
  address: string;
  directorId: string;
  equipment: string;
  security: string;
  outAdv?: string;
  inAdv?: string;
  cashRegister: boolean;
  terminal: boolean;
  ticketLic: boolean;
  holes: HoleModel[];
  workTime: DayModel[];
  canDelete?: boolean;
  regionId: string;
  dcpCode:string;
}
class DayModel {
  start: string;
  end: string;
  weekDay: boolean;
}

export class HoleModel {
  _id?: string;
  name: string;
  placeCount: number;
}
