import {Component, OnInit} from '@angular/core';
import {
  DistributorModel, DistributorReportService,
  DistributorService,
  MovieService,
  PagerService,
  PermissionService,
  TheaterReportService,
  TheaterService
} from 'src/app/core';
import {StatisticService} from "../../../core/services/statistic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dash-rkm',
  templateUrl: './dash-rkm.component.html',
  styleUrls: ['./dash-rkm.component.scss']
})
export class DashRkmComponent implements OnInit {

  isConfirm = false;
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
  currentDist: DistributorModel;
  movies: any[] = [];
  theaters: any[] = [];
  distributors: any[] = [];
  todayThReports: any[] = [];
  todayDistReports: any[] = [];

  pager: any = {};
  pagedItems: any[] = [];

  tableThReportsIsOpen: boolean = true;
  tableDistReportsIsOpen: boolean = true;
  singleMovieChIsOpen: boolean = true;
  singleMovieChModeIsTicket: boolean = true;
  singleMovieChMovieId: string = null;
  singleMovieChLabelY: string = null;
  singleMovieChData: any[] = [];
  singleMovieChOverall: any = {};
  singleMovieChDistData: any[] = [];
  singleMovieChLoadData: boolean = false;
  singleMovieChDistLoadData: boolean = false;

  tableMoviesIsOpen: boolean = true;


  constructor(private pagerService: PagerService,
              private distributorService: DistributorService,
              private moviesService: MovieService,
              public statisticService: StatisticService,
              private theaterService: TheaterService,
              private permissionService: PermissionService,
              private thReportService: TheaterReportService,
              private distributorReportsService: DistributorReportService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.permissionService.reportRKM) {
      for (let i = 0; i < this.permissionService.reportRKM.length; i++) {
        if (this.permissionService.reportRKM[i].value === 4) {
          this.isConfirm = true;
        }
      }
    }
    this.distributorService.getById(this.currentUser.distId).subscribe(data => this.currentDist = data);
    this.moviesService.getAll().subscribe(data => {
      this.movies = data;
      this.singleMovieChMovieId = this.movies[0]._id;
      this.changeMovie();
    });
    this.theaterService.getAll().subscribe(data => this.theaters = data);
    this.distributorService.getAll().subscribe(data => this.distributors = data);
    this.loadReports();
    this.loadTable();
  }

  loadReports() {
    this.thReportService.getReportsByDate(this.currentDate).subscribe(data => {
      this.thReportService.prepareReportsToView(data).subscribe(reports => this.todayThReports = reports);
    });
    this.distributorReportsService.getReportsByDate(this.currentDate).subscribe(data => {
      this.todayDistReports = this.distributorReportsService.prepareReportsToView(data);
    });
  }

  loadTable() {
    this.statisticService.getMoviesByDate().subscribe(data => this.setPage(1, data));
  }

  changeMovie() {
    this.singleMovieChLoadData = false;
    let type = this.singleMovieChModeIsTicket ? 'ticketCount' : 'sum';
    this.singleMovieChLabelY = this.singleMovieChModeIsTicket ? 'Всего продано' : 'Общая сумма';
    this.statisticService.getOverallDataOfMovie(this.singleMovieChMovieId, null, null).subscribe(data => {
      this.singleMovieChOverall = {
        ticketCount: data.totalTicketCount,
        sum: data.totalSum
      };
      this.singleMovieChData = data.moviesData.map(item => {
        return {
          name: item.label,
          value: item[type]
        }
      });
      this.singleMovieChLoadData = true;
      this.loadByDistributors();
    });
  }

  loadByDistributors() {
    this.singleMovieChDistLoadData = false;
    let type = this.singleMovieChModeIsTicket ? 'ticketCount' : 'sum';
    this.statisticService.getMovieDividedByDist(this.singleMovieChMovieId).subscribe(data => {
      this.singleMovieChDistData = data.map(item => {
        return {
          name: item.label,
          value: item[type]
        }

      });
      this.singleMovieChDistLoadData = true;
    });
  }

  actionWithThReport(id: any, state: boolean) {
    let message = state ? 'Вы уверены, что хотите подтвердить отчёт?' : 'Вы уверены, что хотите отменить отчёт?';
    if (confirm(message)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = state;
      reportToConfirm.confirm = state;
      console.log(reportToConfirm);
      this.thReportService.update(reportToConfirm).subscribe(report => {
          this.ngOnInit();
        },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

  actionWithDistReport(id: any, state: boolean) {
    let message = state ? 'Вы уверены, что хотите подтвердить отчёт?' : 'Вы уверены, что хотите отменить отчёт?';
    if (confirm(message)) {
      let reportToConfirm: any = {};
      reportToConfirm._id = id;
      reportToConfirm.sent = state;
      reportToConfirm.confirm = state;
      this.distributorReportsService.update(reportToConfirm).subscribe(report => {
          this.ngOnInit();
        },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        });
    }
  }

  detailRouter(id: string, type: string) {
    this.router.navigate(['/detail-report'], {
      queryParams: {id: id, type: type}
    });
  }

  setPage(page: number, data: any[]) {
    this.pager = this.pagerService.getPager(data.length, page);
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
