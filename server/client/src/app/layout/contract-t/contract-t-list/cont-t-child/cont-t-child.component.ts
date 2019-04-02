import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ContractModel,
  ContractService,
  DistributorModel,
  DistributorService,
  MovieModel,
  MovieService,
  PagerService,
  TheaterModel,
  TheaterService,
  PermissionService
} from 'src/app/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-cont-t-child',
  templateUrl: './cont-t-child.component.html',
  styleUrls: ['./cont-t-child.component.scss']
})
export class ContTChildComponent implements OnInit {

  contracts: ContractModel[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  movies: MovieModel[] = [];
  distributors: DistributorModel[] = [];
  theaters: TheaterModel[] = [];
  theater: TheaterModel = new TheaterModel();
  currentUser = JSON.parse(localStorage.getItem('user'));

  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  contractForDelete: ContractModel = new ContractModel();
  checkWord = '';
  errorOnDelete = false;

  isEdit = false;
  isDelete = false;
  isCreate = false;
  
model: reportModel;

  constructor(private service: ContractService,
              private pagerService: PagerService,
              private movieService: MovieService,
              private theaterService: TheaterService,
              private permissionService: PermissionService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {

    if (this.permissionService.contractDist) {
      for (let i = 0; i < this.permissionService.contractDist.length; i++) {
        if (this.permissionService.contractDist[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.contractDist[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.contractDist[i].value === 0) {
          this.isCreate = true;
        }
      }
      if (this.permissionService.contractTheater) {
        for (let i = 0; i < this.permissionService.contractTheater.length; i++) {
          if (this.permissionService.contractTheater[i].value === 2) {
            this.isEdit = true;
          }
          if (this.permissionService.contractTheater[i].value === 3) {
            this.isDelete = true;
          }
          if (this.permissionService.contractTheater[i].value === 0) {
            this.isCreate = true;
          }
        }
      }
    }

    this.movieService.getAll().subscribe(movies => this.movies = movies);
    this.getAllContracts();
  }

  getAllContracts() {
    this.service.getAll().subscribe(contracts => {
      this.distributorService.getAll().subscribe(distributors => {
        this.theaterService.getAll().subscribe(theaters => {
          this.distributors = distributors;
          this.theaters = theaters;
          if (this.currentUser.distId) {
            this.contracts = contracts.filter(d => d.typeOfCont === 2 && d.firstSide === this.currentUser.distId).reverse();
          } else if (this.currentUser.theaterId) {
              this.contracts = contracts.filter(d => d.typeOfCont === 2 && d.secondSide === this.currentUser.theaterId).reverse();
          }
          if (this.contracts) {
            this.setPage(1);
          }
        });
      });
    });
  }

  openModal(contract: ContractModel) {
    if (new Date(contract.toDate) < new Date()) {
      this.contractForDelete = contract;
      this.canDeleteModal.show();
    } else {
      this.canNotDeleteModal.show();
    }
  }

  closeModal() {
    this.checkWord = '';
    this.canNotDeleteModal.hide();
    this.canDeleteModal.hide();
  }

  deleteContract() {
    if (this.checkWord === 'удалить') {
      this.model = new reportModel();
      this.model.contractId = this.contractForDelete._id;
      this.service.deleteAllData(this.model).subscribe(res => {
        this.getAllContracts()
        this.closeModal();
      });
    } else {
      this.errorOnDelete = true;
      this.checkWord = '';
    }
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.contracts.length, page);
    this.pagedItems = this.contracts.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  // if return 0 - play
  // if return 1 - stop
  // if return 2 - wait
  status(contract: ContractModel): number {
    const current = new Date();
    const start = new Date(contract.fromDate);
    const end = new Date(contract.toDate);
    if (current < start) {
      return 2;
    } else if (current < end) {
      return 0;
    } else if (current > end) {
      return 1;
    }
  }

}

class reportModel{
  contractId: string;
}