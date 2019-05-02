import {BaseModel} from './base.model';

export class TheaterReportModel extends BaseModel {
  _id?: string;
  theaterId: string;
  date: Date;
  withCont: ReportWithCont[];
  withoutCont: ReportWithoutCont[];
  sent: boolean;
  confirm: boolean;
}

class ReportWithCont {
  id?: string;
  movieId: string;
  contractId: string;
  holeId: string;
  sessionTime: string;
  price?: number;
  ticketCount?: number;
  daySession: boolean;
  dayChildTicketCount: number;
  dayAdultTicketCount: number;
  eveningChildTicketCount: number;
  eveningAdultTicketCount: number;
  dayChildTicketPrice: number;
  dayAdultTicketPrice: number;
  eveningChildTicketPrice: number;
  eveningAdultTicketPrice: number;
}

class ReportWithoutCont {
  id?: string;
  movie: string;
  distributor: string;
  country: string;
  sessionCount: number;
}
