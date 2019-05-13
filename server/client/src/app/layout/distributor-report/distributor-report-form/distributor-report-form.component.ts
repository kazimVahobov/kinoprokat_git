import {Component, OnInit} from '@angular/core';
import {
  DistributorReportModel,
  TheaterReportModel,
  DistributorReportService,
  TheaterReportService,
  PagerService,
  TheaterService,
  TheaterModel,
  MovieService,
  MovieModel,
  ContractService,
  ContractModel
} from 'src/app/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-distributor-report-form',
  templateUrl: './distributor-report-form.component.html',
  styleUrls: ['./distributor-report-form.component.scss']
})
export class DistributorReportFormComponent implements OnInit {

  id: string;
  model: DistributorReportModel = new DistributorReportModel();
  mainLabel = 'Новый отчёт';
  currentDate = new Date();
  currentUser = JSON.parse(localStorage.getItem('user'));
  role = JSON.parse(localStorage.getItem('role'));
  // if viewState = 0 - new Report
  // if viewState = 1 - sent && confirm
  // if viewState = 2 - sent && !confirm
  // if viewState = 3 - !sent && !confirm
  viewState = 0;
  movies: MovieOfCont[];
  maxDate = new Date();

  constructor(private service: DistributorReportService,
              private theaterReportService: TheaterReportService,
              private router: Router,
              private pagerService: PagerService,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private contractService: ContractService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.movies = [];
    this.movieService.getAll().subscribe(movies => {
      this.contractService.getAll().subscribe(contracts => {
        let tempContracts = contracts.filter(c => c.typeOfCont === 1 &&
          c.secondSide === this.currentUser.distId);
        tempContracts.forEach(cont => {
          movies.forEach(movie => {
            if (movie._id === cont.movieId) {
              this.movies.push({
                movieName: movie.name,
                movieId: movie._id,
                contId: cont._id,
                dayChildPriceTh: cont.dayChildPriceMobile,
                dayAdultPriceTh: cont.dayAdultPriceMobile,
                eveningChildPriceTh: cont.eveningChildPriceMobile,
                eveningAdultPriceTh: cont.eveningAdultPriceMobile
              });
            }
          });
        });
        this.route.params.subscribe(params => {
          this.id = params['id'];
          if (this.id) {
            this.mainLabel = "Редактирование отчёта";
            this.service.getById(this.id).subscribe(distReport => {
              this.currentDate = new Date(distReport.date);
              this.model = distReport;
            })
          } else {
            this.loadFromDate();
          }
        });

      });
    });
  }

  loadFromDate() {
    this.model = new DistributorReportModel();
    this.model.mobileTheaters = [];
    let distReports: DistributorReportModel[] = [];
    let reportFoundByDate = new DistributorReportModel();
    reportFoundByDate.mobileTheaters = [];
    this.service.getAll().subscribe(reports => {
      distReports = reports.filter(item => item.distId === this.currentUser.distId);
      if (distReports.length != 0) {
        reportFoundByDate = distReports.find(item => new Date(item.date).toDateString() == new Date(this.currentDate).toDateString());
        if (reportFoundByDate) {
          this.setViewState(reportFoundByDate);
        } else {
          this.setViewState(null);
        }
      } else {
        this.setViewState(null);
      }
    });
  }

  setViewState(data: any) {
    if (data == null) {
      this.viewState = 0;
      this.model.distId = this.currentUser.distId;
      this.model.date = this.currentDate;
      this.model.sent = false;
      this.model.confirm = false;
      this.model.mobileTheaters.push({
        movieId: null,
        place: null,
        time: null,
        daySession: true,
        childTicketCount: null,
        adultTicketCount: null,
        childTicketPrice: null,
        adultTicketPrice: null
      });
    } else {
      let report: DistributorReportModel = data as DistributorReportModel;
      if (report.sent && report.confirm) {
        this.viewState = 1;
      } else if (report.sent && !report.confirm) {
        this.viewState = 2;
      } else if (!report.sent && !report.confirm) {
        this.viewState = 3;
      }
    }
  }

  addMobileTheater() {
    this.model.mobileTheaters.push({
      movieId: null,
      place: null,
      time: null,
      daySession: true,
      childTicketCount: null,
      adultTicketCount: null,
      childTicketPrice: null,
      adultTicketPrice: null
    });
    this.validation();
  }

  deleteMobileTheater(index: number) {
    if (this.model.mobileTheaters.length > 1) {
      if (confirm(`Вы уверен, что хотите удалить передвижной кинотеатра?`)) {
        this.model.mobileTheaters.splice(index, 1);
      }
    }
  }

  changeMovie(i: number) {
    let movie: MovieOfCont = this.movies.find(item => item.movieId === this.model.mobileTheaters[i].movieId);
    if (this.model.mobileTheaters[i].daySession) {
      this.model.mobileTheaters[i].minChildTicketPrice = movie.dayChildPriceTh;
      this.model.mobileTheaters[i].minAdultTicketPrice = movie.dayAdultPriceTh;
    } else if (!this.model.mobileTheaters[i].daySession) {
      this.model.mobileTheaters[i].minChildTicketPrice = movie.eveningChildPriceTh;
      this.model.mobileTheaters[i].minAdultTicketPrice = movie.eveningAdultPriceTh;
    }
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/distributor-report']);
    }
  }

  validation(): boolean {
    if (this.model.mobileTheaters.some(i =>
      i.place === null ||
      i.time === null ||
      i.movieId === null ||
      i.adultTicketCount === null ||
      i.childTicketCount === null ||
      i.adultTicketPrice === null ||
      i.childTicketPrice === null)) {
      return false;
    } else if (this.model.mobileTheaters.some(i =>
      i.adultTicketPrice < i.minAdultTicketPrice ||
      i.childTicketPrice < i.minChildTicketPrice)) {
      return false;
    } else {
      return true;
    }
  }

  onSubmit() {
    if (this.id) {
      this.model._id = this.id;
    }
    this.model.distId = this.currentUser.distId;
    this.model.date = this.currentDate;
    this.model.sent = false;
    this.model.confirm = false;
    this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/distributor-report']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        console.log(error.error.message)
      });
  }

}

class MovieOfCont {
  movieName: string;
  movieId: string;
  contId: string;
  dayChildPriceTh: number;
  dayAdultPriceTh: number;
  eveningChildPriceTh: number;
  eveningAdultPriceTh: number;
}
