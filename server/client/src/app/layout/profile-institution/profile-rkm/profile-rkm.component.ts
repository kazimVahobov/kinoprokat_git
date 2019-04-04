import { Component, OnInit, ViewChild } from '@angular/core';
import { DistributorService,
   DistributorModel,
    UserService,
     TheaterService,
      RoleService,
       RoleModel,
        UserModel,
         TheaterModel,
         RegionModel,
         RegionService, } from 'src/app/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-profile-rkm',
  templateUrl: './profile-rkm.component.html',
  styleUrls: ['./profile-rkm.component.scss']
})
export class ProfileRkmComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('user'))
  model: DistributorModel;
  editModel: DistributorModel;
  parent: DistributorModel;
  director: UserModel;
  theaters: TheaterModel[];
  users: UserModel[];
  staff: UserModel[];
  roles: RoleModel[];
  region: RegionModel;

  @ViewChild('editDist') editDistModal: ModalDirective;

  constructor(
    private service: DistributorService,
    private userService: UserService,
    private theaterService: TheaterService,
    private roleService: RoleService,
    private regionService: RegionService
  ) { }

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail() {
    this.users = [];
    this.staff = [];
    this.roles = [];
    this.theaters = [];
    this.region = new RegionModel();
    this.director = new UserModel();
    this.parent = new DistributorModel();
    this.model = new DistributorModel();
    this.editModel = new DistributorModel();
    this.service.getAll().subscribe(distributors => {
      this.userService.getAll().subscribe(users => {
        this.theaterService.getAll().subscribe(theaters => {

            this.model = distributors.find(item => item._id === this.currentUser.distId);
            if (this.model.parentId) {
              this.parent = distributors.find(item => item._id === this.model.parentId);
            }
            users.forEach(item => {
              item.lastName += ` ${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName.substring(0, 1) : ''}. (${item.phone ? item.phone : ''})`;
            });

            this.staff = users.filter(item => item.distId === this.model._id);
            this.users = users.filter(u => u.firstName != 'Super Admin')

            this.theaters = theaters.filter(item => item.distId === this.model._id);
            this.roleService.getAll().subscribe(roles => this.roles = roles);
            this.regionService.getById(this.model.regionId).subscribe(region => this.region = region)
        });
      });
    });
  }

  openModal(distributor: DistributorModel) {
    this.editModel = distributor;
    this.editDistModal.show();
  }

  editDistributor() {
    this.service.update(this.editModel).subscribe(res => {
      this.loadDetail()
      this.closeModal();
    });
  }

  closeModal() {
    this.editDistModal.hide();
  }
}
