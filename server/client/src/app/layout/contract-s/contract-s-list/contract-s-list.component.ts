import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ContractModel,
  TheaterService,
  TheaterModel,
  ContractService,
  PagerService,
  DistributorService,
  MovieService,
  MovieModel,
  DistributorModel,
  PermissionService
} from 'src/app/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-contract-s-list',
  templateUrl: './contract-s-list.component.html',
  styleUrls: ['./contract-s-list.component.scss']
})
export class ContractSListComponent implements OnInit {

  contracts: ContractModel[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];
  movies: MovieModel[] = [];
  currentDistributor: DistributorModel = new DistributorModel();
  distributors: DistributorModel[] = [];
  theaters: TheaterModel[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));

  model: reportModel;

  isEdit = false;
  isDelete = false;
  isCreate = false;

  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  contractForDelete: ContractModel = new ContractModel();
  checkWord = '';
  errorOnDelete = false;

  constructor(private service: ContractService,
              private pagerService: PagerService,
              private movieService: MovieService,
              private theaterService: TheaterService,
              private distributorService: DistributorService,
              private permissionService: PermissionService) {
  }

  ngOnInit() {
    this.movieService.getAll().subscribe(movies => this.movies = movies);
    this.theaterService.getAll().subscribe(theaters => this.theaters = theaters);
    this.getAllContracts();

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
    }

  }

  getAllContracts() {
    this.service.getAll().subscribe(contracts => {
      this.distributorService.getAll().subscribe(distributors => {
        this.distributors = distributors;

        if(this.currentUser.distId) {
          this.currentDistributor = distributors.find(i => i._id === this.currentUser.distId);

          if (this.currentDistributor.parentId) {
            this.contracts = contracts.filter(i => i.typeOfCont === 1 && i.firstSide === this.currentDistributor.parentId && i.secondSide === this.currentDistributor._id).reverse();
          } else {
            this.contracts = contracts.filter(i => i.typeOfCont === 1 && i.firstSide === this.currentDistributor._id).reverse();
          }

        } else {
            this.contracts = contracts.filter(i => i.typeOfCont === 1).reverse();
        }

        if (this.contracts) {
          this.setPage(1);
        }
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
      this.service.getAll().subscribe(contracts => {

            this.model = new reportModel();
            this.model.allContracts = [];

            this.model.allContracts = contracts.filter(c => c.parentId === this.contractForDelete ._id);
            this.model.contractId = this.contractForDelete ._id

            this.service.deleteAllData(this.model).subscribe(res => this.getAllContracts());
            this.closeModal();
      })
    } else {
      this.errorOnDelete = true;
      this.checkWord = '';
    }
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.contracts.length, page);

    // get current page of items
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
class reportModel {
  allContracts: ContractModel[];
  contractId: string;
}
