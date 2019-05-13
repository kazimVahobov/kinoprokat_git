import {Component, OnInit} from '@angular/core';
import {
  TheaterReportModel,
  DistributorReportService,
  TheaterReportService,
  MovieModel,
  MovieService,
  TheaterService,
  HoleModel,
  DistributorReportModel
} from 'src/app/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {


  id: string;
  mainLabel = 'Подробная информация';
  report: ReportModel;
  nameOfHoles: HoleModel[] = [];
  movies: MovieModel[] = [];
  movieMode = true;

  isDistReport = false;

  distReport: DistributorReportModel;
  theaters: TheaterForMobileTheater[];
  theaterReports: TheaterReportModel[];
  theaterId = "";

  constructor(private route: ActivatedRoute,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private theaterReportService: TheaterReportService,
              private ditributorReportService: DistributorReportService,
              private location: Location) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.ditributorReportService.getById(this.id).subscribe(distReports => {
          this.theaterReportService.getAll().subscribe(theaterReports => {
            this.theaterService.getAll().subscribe(theaters => {
              this.theaters = [];
              this.theaterReports = [];
              if (distReports) {

                // this.theaterReports = theaterReports.filter(thReport => distReports.theaterReports.some(i => i.theaterReportsId === thReport._id));
                this.theaters = theaters.filter(theater => this.theaterReports.some(i => i.theaterId === theater._id));
                this.theaters.push({
                  _id: '0',
                  name: 'Передвижной кинотеатр'
                });
                this.theaterId = this.theaters[0]._id;

                this.distReport = new DistributorReportModel();
                this.distReport = distReports;

                this.getTheaterReportsForDistributor();
                this.isDistReport = true;
              } else {
                this.theaters = theaters;
                this.getTheaterReport(this.id);
                this.isDistReport = false;
              }
            })
          })
        })
      }
    });
  }

  backPage() {
    this.location.back();
  }


  getTheaterReportsForDistributor() {
    if (this.theaterId !== '0') {
      this.getTheaterReport(this.theaterReports.find(r => r.theaterId === this.theaterId)._id);
    }
  }

  getTheaterReport(id: string) {
    this.theaterReportService.getById(id).subscribe(report => {

      this.nameOfHoles = this.theaters.find(i => i._id === report.theaterId).holes;
      this.theaterId = this.theaters.find(i => i._id === report.theaterId)._id;

      this.movieService.getAll().subscribe(movies => this.movies = movies);
      this.report = new ReportModel();
      this.report.withoutCont = [];
      this.report.holes = [];
      this.report.date = report.date;
      this.report.theaterId = report.theaterId;
      this.report.withoutCont = report.withoutCont;
      report.withCont.forEach(item => {
        if (!this.report.holes.some(i => i.holeId === item.holeId)) {
          this.report.holes.push({holeId: item.holeId});
          this.report.holes.find(i => i.holeId === item.holeId).sessions = [];
        }
        if (!this.report.movies.some(i => i.movieId === item.movieId)) {
          this.report.movies.push({movieId: item.movieId});
          this.report.movies.find(i => i.movieId === item.movieId).sessions = [];
        }
        this.report.holes.find(i => i.holeId === item.holeId).sessions.push({
          movieId: item.movieId,
          time: item.sessionTime,
          price: item.price,
          ticketCount: item.ticketCount
        });
        this.report.movies.find(i => i.movieId === item.movieId).sessions.push({
          holeId: item.holeId,
          time: item.sessionTime,
          price: item.price,
          ticketCount: item.ticketCount
        });
      });
    });
  }

  overAll(object: any[], mode: number): number {
    let result: number = 0;
    switch (mode) {
      case 0: {
        object.forEach(i => result += i.ticketCount);
        break;
      }
      case 1: {
        object.forEach(i => result += i.ticketCount * i.price);
        break;
      }
      case 2: {
        object.forEach(i => {
          result += i.sessions.length;
        });
        break;
      }
      case 3: {
        object.forEach(i => {
          result += i.sessionCount;
        });
        break;
      }
      case 4: {
        object.forEach(i => {
          i.sessions.forEach(j => {
            result += j.ticketCount;
          });
        });
        break;
      }
      case 5: {
        object.forEach(i => {
          i.sessions.forEach(j => {
            result += j.ticketCount * j.price;
          });
        });
        break;
      }
    }
    return result;
  }
}

class ReportModel {
  date: Date;
  theaterId: string;
  holes: HoleReportModel[] = [];
  movies: MovieReportModel[] = [];
  withoutCont: WithoutCont[] = [];
}

class HoleReportModel {
  holeId: string;
  sessions?: SessionModel[] = [];
}

class MovieReportModel {
  movieId: string;
  sessions?: SessionModel[] = [];
}

class SessionModel {
  movieId?: string;
  holeId?: string;
  time: string;
  price: number;
  ticketCount: number;
}

class WithoutCont {
  movie: string;
  distributor: string;
  country: string;
  sessionCount: number;
}

class TheaterForMobileTheater {
  _id: string;
  name: string;
  holes?: HoleModel[];
}

