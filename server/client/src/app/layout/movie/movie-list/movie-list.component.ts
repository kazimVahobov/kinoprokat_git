import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ContractService,
  MovieService,
  MovieModel,
  PagerService,
  PermissionService,
  DistributorReportService,
  TheaterReportService
} from 'src/app/core';
import {ModalDirective} from "ngx-bootstrap";
import {ContractModel, TheaterReportModel, DistributorReportModel} from "../../../core/models";

@Component({
  selector: 'app-cinema-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];
  movies: MovieModel[];
  currentDate = new Date();
  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  movieForDelete: MovieModel = new MovieModel();
  checkWord = '';
  errorOnDelete = false;

  model: reportModel;
  contracts: ContractModel[];
  theaterReports: TheaterReportModel[];
  distributorReports: DistributorReportModel[];

  isEdit = false;
  isDelete = false;
  isCreate = false;

  constructor(private service: MovieService,
              private contractService: ContractService,
              private pagerService: PagerService,
              private permissionService: PermissionService,
              private distributorReportService: DistributorReportService,
              private theaterReportService: TheaterReportService) {
  }

  ngOnInit() {
    this.getAllCinema();

    if (this.permissionService.movies) {
      for (let i = 0; i < this.permissionService.movies.length; i++) {
        if (this.permissionService.movies[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.movies[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.movies[i].value === 0) {
          this.isCreate = true;
        }
      }
    }

  }

  getAllCinema() {
    this.service.getAll().subscribe(data => {
      this.movies = data.reverse();
      this.contractService.getAll().subscribe(contracts => {
        this.contracts = [];
        this.contracts = contracts.filter(i => i.typeOfCont === 0);
        if (this.contracts.length != 0) {
          this.contracts.forEach(contract => {
            this.movies.forEach(movie => {
              if (contract.movieId === movie._id) {
                if (this.currentDate < new Date(contract.toDate)) {
                  movie.canDelete = false;
                } else if (this.currentDate > new Date(contract.toDate)) {
                  if (movie.canDelete !== false) {
                    movie.canDelete = true;
                  }
                }
              } else if (!this.contracts.some(i => i.movieId === movie._id)) {
                movie.canDelete = true;
              }
            });
          });
        } else {
          this.movies.forEach(movie => {
            movie.canDelete = true;
          });
        }
        // initialize to page 1
        this.setPage(1);
      });

    });
  }

  openModal(movie: MovieModel) {
    this.movieForDelete = movie;
    if (this.movieForDelete.canDelete) {
      this.canDeleteModal.show();
    } else {
      this.canNotDeleteModal.show();
    }
  }

  deleteMovie() {
    if (this.checkWord === 'удалить') {

      this.contractService.getAll().subscribe(contracts => {
        this.distributorReportService.getAll().subscribe(distReports => {
          this.theaterReportService.getAll().subscribe(theaterReports => {

            this.theaterReports = [];
            this.distributorReports = [];
            this.model = new reportModel();
            this.model.contracts = [];
            this.model.deleteDistReport = [];
            this.model.updateDistReport = [];
            this.model.deleteTheaterReports = [];
            this.model.updateTheaterReports = [];

            this.model.contracts = contracts.filter(c => c.movieId === this.movieForDelete._id)
            this.distributorReports = distReports;
            this.theaterReports = theaterReports.filter(th => th.withCont.some(w => w.movieId === this.movieForDelete._id));

            //THEATER REPORTS
            for (let i = 0; i < this.theaterReports.length; i++) {

              for (let j = 0; j < this.theaterReports[i].withCont.length; j++) {
                if (this.theaterReports[i].withCont[j].movieId === this.movieForDelete._id) {
                  this.theaterReports[i].withCont.splice(j, 1);
                  j--;
                }
              }

              if (this.theaterReports[i].withCont.length || this.theaterReports[i].withoutCont.length) {
                this.model.updateTheaterReports.push(this.theaterReports[i]);
              }
              if (!this.theaterReports[i].withCont.length && !this.theaterReports[i].withoutCont.length) {
                this.model.deleteTheaterReports.push(this.theaterReports[i]);
              }

              //DISTRIBUTOR REPORTS  
              if (!this.theaterReports[i].withCont.length) {
                for (let j = 0; j < this.distributorReports.length; j++) {
                  for (let m = 0; m < this.distributorReports[j].theaterReports.length; m++) {
                    if (this.distributorReports[j].theaterReports[m].theaterReportsId === this.theaterReports[i]._id) {
                      this.distributorReports[j].theaterReports.splice(m, 1)
                      m--;
                    }
                  }
                  if (this.distributorReports[j].mobileTheaters.length || this.distributorReports[j].theaterReports.length) {
                    this.model.updateDistReport.push(this.distributorReports[j])
                  }
                  if (!this.distributorReports[j].mobileTheaters.length && !this.distributorReports[j].theaterReports.length) {
                    this.model.deleteDistReport.push(this.distributorReports[j])
                  }
                }
              }

            }

            this.distributorReports = [];
            this.distributorReports = distReports.filter(d => d.mobileTheaters.some(th => th.movieId === this.movieForDelete._id))

            //MOBILE THEATER REPORTS
            for (let a = 0; a < this.distributorReports.length; a++) {
              for (let j = 0; j < this.distributorReports[a].mobileTheaters.length; j++) {
                if (this.distributorReports[a].mobileTheaters[j].movieId === this.movieForDelete._id) {
                  this.distributorReports[a].mobileTheaters.splice(j, 1);
                }
              }
              if (this.distributorReports[a].mobileTheaters.length || this.distributorReports[a].theaterReports.length) {
                this.model.updateDistReport.push(this.distributorReports[a])
              }
              if (!this.distributorReports[a].mobileTheaters.length && !this.distributorReports[a].theaterReports.length) {
                this.model.deleteDistReport.push(this.distributorReports[a])
              }
            }
            this.model.movieId = this.movieForDelete._id

            this.service.deleteAllData(this.model).subscribe(res => {
                this.errorOnDelete = false;
                this.closeModal();
                alert(`Фильм ${this.movieForDelete.name} был успешно удалён`);
                this.getAllCinema();
              },
              error => {
                this.errorOnDelete = false;
                this.closeModal();
                alert(`Произошла неизвестная ошибка, попробуйте снова`);
                console.log(error.error.message)
                this.getAllCinema();
              });
          })
        })
      })

    } else {
      this.errorOnDelete = true;
      this.checkWord = '';
    }
  }

  closeModal() {
    this.checkWord = '';
    this.canNotDeleteModal.hide();
    this.canDeleteModal.hide();
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.movies.length, page);

    // get current page of items
    this.pagedItems = this.movies.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

class reportModel {
  movieId: string;
  deleteDistReport: DistributorReportModel[];
  updateDistReport: DistributorReportModel[];
  deleteTheaterReports: TheaterReportModel[];
  updateTheaterReports: TheaterReportModel[];
  contracts: ContractModel[];
}
