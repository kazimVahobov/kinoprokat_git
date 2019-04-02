import { Component, OnInit } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-distributor-report-form',
  templateUrl: './distributor-report-form.component.html',
  styleUrls: ['./distributor-report-form.component.scss']
})
export class DistributorReportFormComponent implements OnInit {

  model: DistributorReportModel;
  distributorsReport: DistributorReportModel;
  id: string;
  mainLabel = 'Новый отчёт';

  sendReport = false;
  confirmReport = false;

  contracts: ContractModel[] = [];

  currentTheaters: TheaterModel[] = [];

  tempReports: TheaterReportModel[];
  reports: Report[];
  reportsSendEnabled: Report[];
  tempReport: Report;

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  isChecked = false;

  moviesArray: MovieModel[] = [];

  mobileThetersModel: MobileTheters[];

  currendDate = new Date();
  maxDate = new Date();

  currentUser = JSON.parse(localStorage.getItem('user'));
  role = JSON.parse(localStorage.getItem('role'));

  constructor(private service: DistributorReportService,
    private theaterReportService: TheaterReportService,
    private router: Router,
    private pagerService: PagerService,
    private theaterService: TheaterService,
    private movieService: MovieService,
    private contractService: ContractService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.model = new DistributorReportModel();
    this.model.theaterReports = [];
    this.model.mobileTheaters = [];
    this.mobileThetersModel = [];

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.mainLabel = "Редактирование данных отчёта"
        this.service.getById(this.id).subscribe(distReports => {
          this.currendDate = new Date(distReports.date);
          this.mobileThetersModel = distReports.mobileTheaters;
        })
      }
    })

    this.getTheaterReports();

    this.movieService.getAll().subscribe(movie => {
      this.moviesArray = movie;
      this.contractService.getAll().subscribe(contracts => {

        this.contracts = contracts.filter(c => c.typeOfCont === 1 &&
          c.secondSide === this.currentUser.distId);

        this.moviesArray = movie.filter(m => this.contracts.some(c => c.movieId === m._id));

      })
    })
  }

  addMobileTheater() {
    this.mobileThetersModel.push({ movieId: null, place: null, time: null, sessionCount: null, price: null, ticketCount: null });
    this.validation();
  }

  validation(): boolean {
    if (this.currendDate) {
      if (this.mobileThetersModel.length != 0) {
        return !this.mobileThetersModel.some(a => a.movieId === null)
          && !this.mobileThetersModel.some(a => a.place === null)
          && !this.mobileThetersModel.some(a => a.time === null)
          && !this.mobileThetersModel.some(a => a.sessionCount === null)
          && !this.mobileThetersModel.some(a => a.price === null)
          && !this.mobileThetersModel.some(a => a.ticketCount === null);
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  deleteMobileTheater(index: number) {
    if (confirm(`Вы уверен, что хотите удалить передвижной кинотеатра?`)) {
      this.mobileThetersModel.splice(index, 1);
    }
  }

  getTheaterReports() {

    this.reports = [];
    this.reportsSendEnabled = [];
    this.distributorsReport = new DistributorReportModel();
    this.mobileThetersModel = [];
    this.tempReports = [];
    this.theaterService.getAll().subscribe(theaters => {
      this.currentTheaters = theaters.filter(item => item.distId === this.currentUser.distId);
      this.theaterReportService.getAll().subscribe(reportsTheater => {
        this.service.getAll().subscribe(reportsDistributor => {

          this.distributorsReport = reportsDistributor.find(r => 
            new Date(r.date).toDateString() === new Date(this.currendDate).toDateString() &&
            this.currentUser.distId === r.distId)

          if (this.distributorsReport) {
            if (this.distributorsReport.sent === true && this.distributorsReport.confirm === false) {
              this.sendReport = true;
              this.confirmReport = false;
            } else  if (this.distributorsReport.confirm === true && this.distributorsReport.sent === true) {
              this.sendReport = false;
              this.confirmReport = true;
            } else if (this.distributorsReport.confirm === false && this.distributorsReport.sent === false) {
              this.sendReport = false;
              this.confirmReport = false;
            }
          } else {
            this.sendReport = false;
            this.confirmReport = false;
          }
          
          this.tempReports = reportsTheater.filter(item =>
            this.currentTheaters.some(th => item.theaterId === th._id)
            && item.confirm === true &&
            new Date(item.date).toDateString() === new Date(this.currendDate).toDateString());


            if (this.distributorsReport && this.distributorsReport.mobileTheaters) {
              this.mobileThetersModel = this.distributorsReport.mobileTheaters;
            }

          for (let i = 0; i < this.tempReports.length; i++) {

            this.tempReport = new Report();
            this.tempReport.movies = [];
            this.tempReport.ticketCount = 0;
            this.tempReport.summ = 0;
            this.tempReport.theaterId = this.tempReports[i].theaterId;
            this.tempReport._id = this.tempReports[i]._id;
            this.tempReport.confirm = this.tempReports[i].confirm
            this.tempReport.checked = false;
            this.tempReport.sessionCount = this.tempReports[i].withCont.length;

            if (this.distributorsReport) {
              this.model._id = this.distributorsReport._id;

              if (this.distributorsReport.theaterReports) {
                if (this.distributorsReport.theaterReports.some(r => r.theaterReportsId === this.tempReports[i]._id)) {
                  this.tempReport.checked = true;
                } 
              }
            } else {
              this.model._id = null;
            }

            for (let j = 0; j < this.tempReports[i].withCont.length; j++) {
              if (!this.tempReport.movies.some(item => item === this.tempReports[i].withCont[j].movieId)) {
                this.tempReport.movies.push(this.tempReports[i].withCont[j].movieId);
              }
              this.tempReport.ticketCount += this.tempReports[i].withCont[j].ticketCount;
              this.tempReport.summ += this.tempReports[i].withCont[j].ticketCount * this.tempReports[i].withCont[j].price;
            }

            this.reports.push(this.tempReport);
          }

          this.reportsSendEnabled = this.reports.filter(r => r.confirm === true);

          this.ReportChecked();
          this.reports = this.reports.reverse();
          this.setPage(1)
        })
      });
    });
  }

  onSubmit() {

    this.reports = [];
    this.reports = this.reportsSendEnabled.filter(r => r.checked)

    this.model.sent = false;
    this.model.confirm = false;
    this.model.date = this.currendDate;
    this.model.distId = this.currentUser.distId;

    for (let i = 0; i < this.reports.length; i++) {
      this.model.theaterReports.push({ theaterReportsId: this.reports[i]._id });
    }

    if (this.mobileThetersModel.length != 0) {
      for (let i = 0; i < this.mobileThetersModel.length; i++) {
        this.model.mobileTheaters.push({
          movieId: this.mobileThetersModel[i].movieId,
          place: this.mobileThetersModel[i].place,
          time: this.mobileThetersModel[i].time,
          sessionCount: this.mobileThetersModel[i].sessionCount,
          price: this.mobileThetersModel[i].price,
          ticketCount: this.mobileThetersModel[i].ticketCount
        });
      }
    }
    if (this.mobileThetersModel.length != 0 || this.reports.length != 0) {
      this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/distributor-report']);
      },
        error => {
          alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
          console.log(error.error.message)
        });
    } else {
      alert('Пожалуйста выберите хотя бы одно отчёта');
    }
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/distributor-report']);
    }
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.reports.length, page);
    // get current page of items
    this.pagedItems = this.reports.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  ReportChecked() {
    this.isChecked = this.reportsSendEnabled.some(a => a.checked);
  }

  AllReportsChecked() {
    for (let i = 0; i < this.reportsSendEnabled.length; i++) {
      this.reportsSendEnabled[i].checked = this.isChecked;
    }
  }

  isIndeterminated(): boolean {
    return this.reportsSendEnabled.some(a => a.checked) && this.reportsSendEnabled.some(a => !a.checked);
  }
}

class Report {
  _id?: string;
  theaterId: string;
  checked: boolean;
  movies: string[];
  sessionCount: number;
  ticketCount: number;
  summ: number;
  confirm: boolean;
}
class MobileTheters {
  _id?: string;
  movieId: string;
  place: string;
  time: Date;
  sessionCount: number;
  price: number;
  ticketCount: number;
}