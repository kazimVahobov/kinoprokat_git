import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ContractModel,
  ContractService,
  DistributorModel,
  UserModel,
  PagerService,
  DistributorService,
  UserService,
  PermissionService,
  DistributorReportService,
  TheaterReportService,
  TheaterService,
  TheaterReportModel,
  DistributorReportModel,
  TheaterModel,
  RegionModel,
  RegionService
} from 'src/app/core';
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: 'app-distributor-list',
  templateUrl: './distributor-list.component.html',
  styleUrls: ['./distributor-list.component.scss']
})
export class DistributorListComponent implements OnInit {
  users: UserModel[] = [];
  pager: any = {};
  pagedItems: any[];
  distributors: DistributorModel[];
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentDate = new Date();
  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  distForDelete: DistributorModel = new DistributorModel();
  checkWord = '';
  errorOnDelete = false;

  model: reportModel;
  contracts: ContractModel[];
  contractsDistTheater: ContractModel[];
  contractsTheater: ContractModel[];

  isEdit = false;
  isDelete = false;
  isCreate = false;

regions: RegionModel[];

  constructor(private service: DistributorService,
    private userService: UserService,
    private contractService: ContractService,
    private pagerService: PagerService,
    private permissionService: PermissionService,
    private distReportService: DistributorReportService,
    private theaterReportService: TheaterReportService,
    private theaterService: TheaterService,
    private regionService: RegionService
  ) {
  }

  ngOnInit() {
    this.getAll();
    this.loadUsers();

    this.regionService.getAll().subscribe(regions => {
      this.regions = regions
    })

    if (this.permissionService.distributors) {
      for (let i = 0; i < this.permissionService.distributors.length; i++) {
        if (this.permissionService.distributors[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.distributors[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.distributors[i].value === 0) {
          this.isCreate = true;
        }
      }
    }

  }

  getAll() {
    this.service.getAll().subscribe(distributors => {
      this.distributors = distributors.filter(i => i.parentId === this.currentUser.distId).reverse();
      if (this.distributors.length != 0) {
        this.contractService.getAll().subscribe(contracts => {
          this.contracts = [];
          this.contracts = contracts.filter(i => i.typeOfCont === 1);
          if(this.contracts) {
          this.contracts.forEach(cont => {
            this.distributors.forEach(dist => {
              if (cont.secondSide === dist._id) {
                if (this.currentDate < new Date(cont.toDate)) {
                  dist.canDelete = false;
                } else if (this.currentDate > new Date(cont.toDate)) {
                  if (dist.canDelete !== false) {
                    dist.canDelete = true;
                  }
                }
              } else if (!this.contracts.some(i => i.secondSide === dist._id)) {
                dist.canDelete = true;
              }
            });
          });
        } else {
          this.distributors.forEach(dist => {
              dist.canDelete = true;
          });
        }
        });
        this.setPage(1);
      }
    });
  }

  loadUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
      for (let i = 0; i < this.users.length; i++) {
        this.users[i].lastName += ` ${this.users[i].firstName ? this.users[i].firstName : ''} ${this.users[i].middleName ? this.users[i].middleName.substring(0, 1) : ''}. (${this.users[i].phone ? this.users[i].phone : ''})`;
      }
    });
  }

  openModal(dist: DistributorModel) {
    this.distForDelete = dist;
    if (this.distForDelete.canDelete) {
      this.canDeleteModal.show();
    } else {
      this.canNotDeleteModal.show();
    }
  }

  deleteDistributor() {
    if (this.checkWord === 'удалить') {

      this.theaterService.getAll().subscribe(theaters => {
        this.contractService.getAll().subscribe(contracts => {
          this.distReportService.getAll().subscribe(distReports => {
            this.theaterReportService.getAll().subscribe(theaterReports => {

              this.contracts = [];
              this.contractsTheater = [];
              this.contractsDistTheater = [];
              this.model = new reportModel();
              this.model.contracts = [];
              this.model.deleteDistReport = [];
              this.model.deleteTheaterReports = [];
              this.model.theaters = [];

              //Get Theater
              this.model.theaters = theaters.filter(th => th.distId === this.distForDelete._id)

              //Get Contract
              this.model.contracts = contracts.filter(c => c.secondSide === this.distForDelete._id)
              for (let j = 0; j < contracts.length; j++) {
                if (contracts[j].firstSide === this.distForDelete._id) {
                  this.model.contracts.push(contracts[j]);
                }
              }
              for (let i = 0; i < this.model.theaters.length; i++) {
                for (let j = 0; j < contracts.length; j++) {
                  if (contracts[j].secondSide === this.model.theaters[i]._id) {
                    this.model.contracts.push(contracts[j]);
                  }
                }
                //Get TheaterReport
                for (let j = 0; j < theaterReports.length; j++) {
                  if (theaterReports[j].theaterId === this.model.theaters[i]._id) {
                    this.model.deleteTheaterReports.push(theaterReports[j]);
                  }
                }
              }
              //Get Dist Report
              for (let j = 0; j < distReports.length; j++) {
                if (distReports[j].distId === this.distForDelete._id) {
                  this.model.deleteDistReport.push(distReports[j]);
                }
              }

              this.model.distId = this.distForDelete._id;
              this.service.deleteAllData(this.model).subscribe(res => {
                this.errorOnDelete = false;
                this.closeModal();
                alert(`Дистрибьютор ${this.distForDelete.name} был успешно удалён`);
                this.getAll();
              },
                error => {
                  this.errorOnDelete = false;
                  this.closeModal();
                  alert(`Произошла неизвестная ошибка, попробуйте снова`);
                  this.getAll();
                });
            })
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
    this.pager = this.pagerService.getPager(this.distributors.length, page);
    this.pagedItems = this.distributors.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
class reportModel {
  distId: string;
  deleteDistReport: DistributorReportModel[];
  deleteTheaterReports: TheaterReportModel[];
  contracts: ContractModel[];
  theaters: TheaterModel[];
}