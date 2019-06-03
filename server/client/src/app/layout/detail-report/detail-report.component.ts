import {Component, OnInit} from '@angular/core';
import {
  DistributorModel,
  DistributorReportModel,
  DistributorReportService,
  DistributorService,
  MovieModel,
  MovieService,
  TheaterModel,
  TheaterReportModel,
  TheaterReportService,
  TheaterService,
  ContractService, ContractModel
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
  type: string;
  mainLabel = 'Подробная информация';
  overallDistReport: ReportOverall;
  currentDistReport: DistributorReportModel;
  distributors: DistributorModel[];
  movies: MovieModel[];
  contracts: ContractModel[];

  theaters: TheaterModel[];
  currentTheaterReport: TheaterReportModel;
  overallTheaterReport: ReportOverall;
  holes: Hole[];


  constructor(private route: ActivatedRoute,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private theaterReportService: TheaterReportService,
              private distributorReportService: DistributorReportService,
              private distributorService: DistributorService,
              private contractService: ContractService,
              private location: Location) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (this.type == 'dist') {
        this.loadDistReport(this.id);
      } else if (this.type == 'theater') {
        this.loadTheaterReport(this.id);
      }
    });
  }

  loadDistReport(id: string) {
    this.distributors = [];
    this.movies = [];
    this.contracts = [];
    this.currentDistReport = new DistributorReportModel();
    this.currentDistReport.mobileTheaters = [];
    this.overallDistReport = new ReportOverall();
    this.movieService.getAll().subscribe(movies => {
      this.movies = movies;
      this.distributorService.getAll().subscribe(distributors => {
        this.distributors.push(...distributors);
        this.distributorReportService.getById(id).subscribe(report => {
          this.currentDistReport = report;
          this.contractService.getAll().subscribe(contracts => {
            this.contracts = contracts;
            report.mobileTheaters.forEach(session => {
              this.overallDistReport.childTicketCount += session.childTicketCount;
              this.overallDistReport.adultTicketCount += session.adultTicketCount;
              this.overallDistReport.childTicketSum += session.childTicketCount * session.childTicketPrice;
              this.overallDistReport.adultTicketSum += session.adultTicketCount * session.adultTicketPrice;
              this.overallDistReport.overallTicketCount += session.childTicketCount + session.adultTicketCount;
              this.overallDistReport.overallTicketSum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
            });
          });
        });
      });
    });
  }

  loadTheaterReport(id: string) {
    this.holes = [];
    this.theaters = [];
    this.movies = [];
    this.contracts = [];
    this.currentTheaterReport = new TheaterReportModel();
    this.currentTheaterReport.withCont = [];
    this.currentTheaterReport.withoutCont = [];
    this.overallTheaterReport = new ReportOverall();
    this.theaterService.getAll().subscribe(theaters => {
      this.theaters = theaters;
      this.theaters.forEach(i => {
        i.holes.forEach(j => {
          this.holes.push({
            _id: j._id,
            name: j.name
          });
        });
      });
      this.movieService.getAll().subscribe(movies => {
        this.movies = movies;
        this.theaterReportService.getById(id).subscribe(report => {
          this.currentTheaterReport = report;
          this.contractService.getAll().subscribe(contracts => {
            this.contracts = contracts;
            report.withCont.forEach(session => {
              this.overallTheaterReport.childTicketCount += session.childTicketCount;
              this.overallTheaterReport.adultTicketCount += session.adultTicketCount;
              this.overallTheaterReport.childTicketSum += session.childTicketCount * session.childTicketPrice;
              this.overallTheaterReport.adultTicketSum += session.adultTicketCount * session.adultTicketPrice;
              this.overallTheaterReport.overallTicketCount += session.childTicketCount + session.adultTicketCount;
              this.overallTheaterReport.overallTicketSum += (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice);
            });
          });
        });
      });
    });
  }

  backPage() {
    this.location.back();
  }

}

class ReportOverall {
  childTicketCount: number = 0;
  adultTicketCount: number = 0;
  childTicketSum: number = 0;
  adultTicketSum: number = 0;
  overallTicketCount: number = 0;
  overallTicketSum: number = 0;
}

class Hole {
  _id: string;
  name: string;
}
