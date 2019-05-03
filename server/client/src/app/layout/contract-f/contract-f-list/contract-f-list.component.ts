import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ContractModel,
  ContractService,
  PagerService,
  DistributorService,
  MovieService,
  MovieModel,
  DistributorModel,
  PermissionService,
  UserService,
  UserModel,
  RoleService
} from 'src/app/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-contract-f-list',
  templateUrl: './contract-f-list.component.html',
  styleUrls: ['./contract-f-list.component.scss']
})
export class ContractFListComponent implements OnInit {

  contracts: ContractModel[];

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];
  movies: MovieModel[];
  distributors: DistributorModel[];
  currentUser = JSON.parse(localStorage.getItem('user'));

  isEdit = false;
  isDelete = false;
  isCreate = false;

  model: reportModel;

  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  @ViewChild('createUser') createUser: ModalDirective;
  contractForDelete: ContractModel = new ContractModel();
  checkWord = '';
  errorOnDelete = false;

  users: UserModel[];
  userModel: UserModel;
  contract: ContractModel;
  roleId: string;

  constructor(private service: ContractService,
              private pagerService: PagerService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private permissionService: PermissionService,
              private userService: UserService,
              private roleService: RoleService) {
  }

  ngOnInit() {
    this.roleId = '';

    this.getAllContracts();

    this.userModel = new UserModel();
    if (this.permissionService.contractRKM) {
      for (let i = 0; i < this.permissionService.contractRKM.length; i++) {
        if (this.permissionService.contractRKM[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.contractRKM[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.contractRKM[i].value === 0) {
          this.isCreate = true;
        }
      }
    }

  }

  getAllContracts() {
    this.contracts = [];
    this.distributors = [];
    this.movies = [];
    this.users = [];
    this.movieService.getAll().subscribe(movies => this.movies = movies);
    this.userService.getAll().subscribe(users => {
      this.service.getAll().subscribe(contracts => {
        this.distributorService.getAll().subscribe(distributors => {
          this.users = users;
          this.distributors = distributors;


          if (this.currentUser.distId) {
            this.contracts = contracts.filter(item => item.secondSide === this.currentUser.distId && item.typeOfCont === 0).reverse();
          } else {
            this.contracts = contracts.filter(item => item.typeOfCont === 0).reverse();
          }
          if (this.contracts.length !== 0) {
            this.setPage(1);
          }

          this.contracts.forEach(contract => {
            users.forEach(user => {
              if (contract.movieId === user.movieId) {
                contract.movieUser = user.userName;
              }
            });
          });
        });
      });
    });
  }

  openModal(contract: ContractModel) {
    this.contractForDelete = contract;
    if (new Date(contract.toDate) < new Date()) {
      this.canDeleteModal.show();
    } else {
      this.canNotDeleteModal.show();
    }
  }

  createUserModal(contract: ContractModel) {
    this.roleService.getAll().subscribe(roles => {
      this.roleId = roles.find(r => r.name === 'Guest Movie Role')._id;
      this.createUser.show();
      this.contract = new ContractModel();
      this.contract = contract;
    });
  }


  validation(): boolean {
    if (this.userModel) {
      return !(!this.userModel.userName || !(this.userModel.newPassword === this.userModel.password));
    } else {
      return false;
    }
  }

  confirmPassword(): boolean {
    if (this.userModel.newPassword) {
      return this.userModel.newPassword !== this.userModel.password;
    } else {
      return false;
    }
  }

  CreateUserForContract() {

    this.userModel.movieId = this.contract.movieId;
    this.userModel.firstName = this.userModel.userName;
    this.userModel.lastName = this.userModel.userName;
    this.userModel.roleId = this.roleId;
    this.userService.create(this.userModel).subscribe((user) =>
      this.getAllContracts());
    this.closeModal()
  }


  deleteContract() {
    if (this.checkWord === 'удалить') {
      this.service.getAll().subscribe(contracts => {

        this.model = new reportModel();
        this.model.allContracts = [];
        this.contracts = [];

        this.model.allContracts = contracts.filter(c => c.parentId === this.contractForDelete._id);

        for (let i = 0; i < this.model.contracts.length; i++) {
          for (let j = 0; j < contracts.length; j++) {
            if (contracts[j].parentId === this.model.contracts[i]._id) {
              this.contracts.push(contracts[j])
            }
          }
        }

        for (let i = 0; i < this.contracts.length; i++) {
          this.model.contracts.push(this.contracts[i])
        }
        this.model.contractId = this.contractForDelete._id
        this.service.deleteAllData(this.model).subscribe(res => this.getAllContracts());
        this.closeModal();
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
    this.createUser.hide();
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
  contracts: ContractModel[];
  contractId: string;
}
