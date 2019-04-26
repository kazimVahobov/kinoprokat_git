import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ContractService,
  ContractModel,
  PagerService,
  TheaterModel,
  TheaterService,
  UserModel,
  UserService,
  PermissionService,
  TheaterReportService,
  DistributorReportService,
  DistributorReportModel,
  TheaterReportModel,
  RegionService,
  RegionModel
} from 'src/app/core';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-theater-child',
  templateUrl: './theater-child.component.html',
  styleUrls: ['./theater-child.component.scss']
})
export class TheaterChildComponent implements OnInit {

  users: UserModel[] = [];
  theaterList: TheaterModel[] = [];
  pager: any = {};
  pagedItems: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));

  model: reportModel;
  contracts: ContractModel[];
  theaterReports: TheaterReportModel[];
  distributorReports: DistributorReportModel[];

  currentDate = new Date();
  @ViewChild('canDeleteModal') canDeleteModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  theaterForDelete: TheaterModel = new TheaterModel();
  checkWord = null;
  errorOnDelete = false;

  isDelete = false;
  isEdit = false;

  regions: RegionModel[];

  constructor(private service: TheaterService,
              private userService: UserService,
              private contractService: ContractService,
              private pagerService: PagerService,
              private permissionService: PermissionService,
              private theaterReportService: TheaterReportService,
              private distReportService: DistributorReportService,
              private regionService: RegionService
  ) {
  }


  ngOnInit() {
    this.getAllTheater();

    this.regions = [];
    this.regionService.getAll().subscribe(regions => {
      this.regions = regions;
    });

    if (this.permissionService.theaters) {
      for (let i = 0; i < this.permissionService.theaters.length; i++) {
        if (this.permissionService.theaters[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.theaters[i].value === 3) {
          this.isDelete = true;
        }
      }
    }
  }

  getAllTheater() {
    this.contracts = [];
    this.service.getAll().subscribe(theaters => {
      this.userService.getAll().subscribe(users => {
        this.contractService.getAll().subscribe(contracts => {
          this.contracts = contracts.filter(i => i.typeOfCont === 2);
          this.users = users;
          this.users.forEach(i => i.lastName += ` ${i.firstName ? i.firstName : ''} ${i.middleName ? i.middleName.substring(0, 1) : ''}. (${i.phone ? i.phone : ''})`);
          this.theaterList = theaters.filter(i => i.distId === this.currentUser.distId).reverse();
          if (this.contracts.length != 0) {
            this.contracts.forEach(cont => {
              this.theaterList.forEach(theater => {
                if (cont.secondSide === theater._id) {
                  if (this.currentDate < new Date(cont.toDate)) {
                    theater.canDelete = false;
                  } else if (this.currentDate > new Date(cont.toDate)) {
                    if (theater.canDelete !== false) {
                      theater.canDelete = true;
                    }
                  }
                } else if (!this.contracts.some(i => i.secondSide === theater._id)) {
                  theater.canDelete = true;
                }
              });
            });
          } else {
            this.theaterList.forEach(th => th.canDelete = true);
          }
          this.setPage(1);
        });
      });
    });
  }

  openModal(theater: TheaterModel) {
    this.theaterForDelete = theater;
    this.errorOnDelete = false;
    this.checkWord = null;
    if (this.theaterForDelete.canDelete) {
      this.canDeleteModal.show();
    } else {
      this.canNotDeleteModal.show();
    }
  }

  deleteTheater() {
    if (this.checkWord === 'удалить') {


      this.contractService.getAll().subscribe(contracts => {
        this.theaterReportService.getAll().subscribe(theaterReports => {
          this.distReportService.getAll().subscribe(distReports => {

            this.theaterReports = [];
            this.distributorReports = [];
            this.model = new reportModel();
            this.model.contracts = [];
            this.model.deleteDistReport = [];
            this.model.updateDistReport = [];
            this.model.deleteTheaterReports = [];

            this.model.contracts = contracts.filter(c => c.secondSide === this.theaterForDelete._id);
            this.distributorReports = distReports;
            this.theaterReports = theaterReports.filter(th => th.theaterId === this.theaterForDelete._id)

            for (let i = 0; i < this.theaterReports.length; i++) {
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
            this.model.theaterId = this.theaterForDelete._id;
            this.model.deleteTheaterReports = this.theaterReports;

            this.service.deleteAllData(this.model).subscribe(res => {
                this.errorOnDelete = false;
                this.closeModal();
                alert(`Кинотеатр ${this.theaterForDelete.name} был успешно удалён`);
                this.getAllTheater();
              },
              error => {
                this.errorOnDelete = false;
                this.closeModal();
                alert(`Произошла неизвестная ошибка, попробуйте снова`);
                this.getAllTheater();
              });

          })
        })
      })
    } else {
      this.errorOnDelete = true;
      this.checkWord = null;
    }
  }

  closeModal() {
    this.checkWord = null;
    this.canNotDeleteModal.hide();
    this.canDeleteModal.hide();
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.theaterList.length, page);
    this.pagedItems = this.theaterList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  placeCount(theater: TheaterModel): number {
    let summ = 0;
    theater.holes.forEach(i => summ += i.placeCount);
    return summ;
  }
}


class reportModel {
  theaterId: string;
  deleteDistReport: DistributorReportModel[];
  updateDistReport: DistributorReportModel[];
  deleteTheaterReports: TheaterReportModel[];
  contracts: ContractModel[];
}
