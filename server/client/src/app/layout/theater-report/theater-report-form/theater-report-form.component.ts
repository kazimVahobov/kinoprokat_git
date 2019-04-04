import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ContractModel,
  ContractService,
  TheaterService,
  MovieModel,
  TheaterReportService,
  MovieService,
  TheaterReportModel
} from 'src/app/core';

@Component({
  selector: 'app-theater-report-form',
  templateUrl: './theater-report-form.component.html',
  styleUrls: ['./theater-report-form.component.scss']
})
export class TheaterReportFormComponent implements OnInit {

  id: string;
  mainLabel = 'Новый отчёт';
  model: ReportModel;
  movies: MovieModel[];
  movieOfCont: MovieOfCont[];
  tempContracts: ContractModel[];
  tempReport: TheaterReportModel
  selectedDate: Date = new Date();
  currentUser = JSON.parse(localStorage.getItem('user'));
  alertState: number = 0;
  disableDate = true;
  maxDate = new Date();
  
  minPriceTicket:number;

  constructor(private service: TheaterReportService,
              private theaterService: TheaterService,
              private contractService: ContractService,
              private moviesService: MovieService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.minPriceTicket = 0;
    this.route.params.subscribe(params => {

      this.id = params['id'];
      if (this.id) {
        this.mainLabel = "Редактирование данных отчёта"
        this.service.getById(this.id).subscribe(report => {
          if (report.sent && report.confirm) {
            this.alertState = 1;
          } else if (report.sent && !report.confirm) {
            this.alertState = 2;
          } else if (!report.sent && !report.confirm) {
            this.alertState = 0;
            this.selectedDate = new Date(report.date);
            this.disableDate = false;
            this.loadOnEdit(report);
          }
        });
      } else {
        this.loadFromDate();
      }
    });
  }

  loadFromDate() {
    this.movies = [];
    this.movieOfCont = [];
    this.tempContracts = [];
    this.tempReport = new TheaterReportModel();
    this.model = new ReportModel();
    this.model.holes = [];
    this.model.withoutCont = [];
    this.model.date = this.selectedDate;
    this.theaterService.getById(this.currentUser.theaterId).subscribe(currentTheater => {
      if (currentTheater) {
        this.service.getAll().subscribe(reports => {
          this.tempReport = reports.find(i => i.theaterId === currentTheater._id &&
            new Date(i.date).toDateString() == new Date(this.selectedDate).toDateString());
          if (this.tempReport) {
            this.setAlert(this.tempReport);
          } else {
            this.alertState = 0;
            this.model.theaterId = currentTheater._id;
            for (let i = 0; i < currentTheater.holes.length; i++) {
              this.model.holes.push({
                holeId: currentTheater.holes[i]._id,
                holeName: currentTheater.holes[i].name,
                placeCount: currentTheater.holes[i].placeCount,
                sessions: []
              });
            }

            this.contractService.getAll().subscribe(contracts => {
              this.tempContracts = contracts.filter(item => item.typeOfCont === 2 && item.secondSide === this.currentUser.theaterId)
                .filter(item => this.model.date > new Date(item.fromDate) && this.model.date < new Date(item.toDate));
              this.moviesService.getAll().subscribe(movies => {
                this.tempContracts.forEach(cont => {
                  for (let i = 0; i < movies.length; i++) {
                    if (movies[i]._id === cont.movieId) {
                      this.movies.push(movies[i]);
                      this.movieOfCont.push({movieId: movies[i]._id, contId: cont._id});
                    }
                  }
                });
              });
            });
          }
        });
      }
    });
  }

  loadOnEdit(report: TheaterReportModel) {
    this.contractService.getAll().subscribe(contracts => {

      this.model = new ReportModel();
      this.model.holes = [];
      this.model.withoutCont = [];

      this.model.date = new Date(report.date);
      this.model.theaterId = report.theaterId;
      this.model.withoutCont = report.withoutCont;

      this.movies = [];
      this.movieOfCont = [];

      this.tempContracts = contracts.filter(item => item.typeOfCont === 2 && item.secondSide === this.currentUser.theaterId)
        .filter(item => this.model.date > new Date(item.fromDate) && this.model.date < new Date(item.toDate));
      this.moviesService.getAll().subscribe(movies => {
        this.tempContracts.forEach(cont => {
          for (let i = 0; i < movies.length; i++) {
            if (movies[i]._id === cont.movieId) {
              this.movies.push(movies[i]);
              this.movieOfCont.push({movieId: movies[i]._id, contId: cont._id});
            }
          }
        });

        this.theaterService.getById(this.currentUser.theaterId).subscribe(theater => {
          theater.holes.forEach(item => this.model.holes.push({
            holeId: item._id,
            holeName: item.name,
            placeCount: item.placeCount,
            sessions: []
          }));

          report.withCont.forEach(item => {

            this.model.holes.find(i => i.holeId === item.holeId).sessions.push({
              movieId: item.movieId,
              contractId: item.contractId,
              time: item.sessionTime,
              price: item.price,
              ticketCount: item.ticketCount
            });
          });
        });
      });
    });

  }

  // if return 1 - sent and confirmed
  // if return 2 - sent and no confirmed
  // if return 3 - no sent and no confirmed
  setAlert(report: TheaterReportModel) {
    if (report.sent && report.confirm) {
      this.alertState = 1;
    } else if (report.sent && !report.confirm) {
      this.alertState = 2;
    } else if (!report.sent && !report.confirm) {
      this.alertState = 3;
    }
  }

  addSession(i: number) {
    this.model.holes[i].sessions.push({
      movieId: null,
      contractId: '',
      time: '',
      price: null,
      ticketCount: null
    });
  }

  // if return true - disabled
  // else if return false - enabled
  validation(): boolean {
    if (this.model) {
      let result: boolean;
      result = !this.model.holes.find(item => item.sessions.length !== 0);
      if (this.model.withoutCont.find(item => !item.movie || !item.country || !item.distributor || !item.sessionCount)) {
        result = true;
      }
      if (this.model.holes.find(item => item.sessions.some(i => !i.time || !i.movieId || !i.ticketCount || !i.price))) {
        result = true;
      }
      return result;
    } else {
      return false;
    }
  }

  addWithoutCont() {
    this.model.withoutCont.push({
      movie: null,
      distributor: null,
      country: null,
      sessionCount: null
    });
  }

  deleteSession(holeInx: number, sessionInx: number) {
    if (confirm(`Вы уверен, что хотите удалить ${sessionInx + 1}-й сеанс?`)) {
      this.model.holes[holeInx].sessions.splice(sessionInx, 1);
    }
  }

  deleteWithoutCont(i: number) {
    if (confirm(`Вы уверен, что хотите удалить ${i + 1}-й фильм?`)) {
      this.model.withoutCont.splice(i, 1);
    }
  }

  movieChange(hole: number, session: number) {
    if (this.model.holes[hole].sessions[session].movieId) {
      const contract = this.movieOfCont.find(i => i.movieId === this.model.holes[hole].sessions[session].movieId).contId;
      this.model.holes[hole].sessions[session].contractId = contract;
    }
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/theater-report']);
    }
  }

  submit() {
    let report: TheaterReportModel = new TheaterReportModel();
    if (this.id) {
      report._id = this.id;
    }
    report.withCont = [];
    report.withoutCont = [];
    report.theaterId = this.model.theaterId;
    report.date = this.model.date;
    report.sent = false;
    report.confirm = false;
    this.model.holes.forEach(i => {
      if (i.sessions) {
        i.sessions.forEach(session => {
          if (session) {
            report.withCont.push({
              movieId: session.movieId,
              contractId: session.contractId,
              holeId: i.holeId,
              sessionTime: session.time,
              price: session.price,
              ticketCount: session.ticketCount
            });
          }
        });
      }
    });
    if (this.model.withoutCont) {
      this.model.withoutCont.forEach(i => {
        report.withoutCont.push({
          movie: i.movie,
          distributor: i.distributor,
          country: i.country,
          sessionCount: i.sessionCount
        });
      });
    }
    this.service.save(report).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/theater-report']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }
}

class ReportModel {
  date: Date;
  theaterId: string;
  holes: HoleModel[];
  withoutCont: WithoutCont[];
}

class HoleModel {
  holeId: string;
  holeName: string;
  placeCount: number;
  sessions?: SessionModel[];
}

class SessionModel {
  movieId: string;
  contractId: string;
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

class MovieOfCont {
  movieId: string;
  contId: string;
}
