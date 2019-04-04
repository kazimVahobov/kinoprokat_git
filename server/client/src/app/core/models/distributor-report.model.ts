export class DistributorReportModel {
  _id?: string;
  distId: string;
  date: Date;
  sent: boolean;
  theaterReports: TheaterReports[];
  mobileTheaters: ReportMobileTheater[];
  confirm: boolean;
}

class ReportMobileTheater {
  _id?: string;
  movieId: string;
  place: string;
  time: Date;
  sessionCount: number;
  price: number;
  ticketCount: number;
}
class TheaterReports {
  theaterReportsId: string;
}