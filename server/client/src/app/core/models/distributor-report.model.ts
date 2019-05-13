export class DistributorReportModel {
  _id?: string;
  distId: string;
  date: Date;
  sent: boolean;
  confirm: boolean;
  mobileTheaters: ReportMobileTheater[];
}

class ReportMobileTheater {
  _id?: string;
  movieId: string;
  place: string;
  time: Date;
  daySession: boolean;
  childTicketCount: number;
  adultTicketCount: number;
  childTicketPrice: number;
  adultTicketPrice: number;
  minChildTicketPrice?: number;
  minAdultTicketPrice?: number;
}
