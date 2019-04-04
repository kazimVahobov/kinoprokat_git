import { Component, OnInit, ViewChild } from '@angular/core';
import {
  TheaterService,
  TheaterModel,
  UserModel,
  UserService,
  RoleService,
  RoleModel,
  RegionService,
  RegionModel
} from 'src/app/core';

@Component({
  selector: 'app-profile-theater',
  templateUrl: './profile-theater.component.html',
  styleUrls: ['./profile-theater.component.scss']
})
export class ProfileTheaterComponent implements OnInit {

  model: TheaterModel;
  editModel: TheaterModel;
  region: RegionModel;
  staff: UserModel[] = [];
  roles: RoleModel[] = [];
  days = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'];

  currentRole = JSON.parse(localStorage.getItem('role'));
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private service: TheaterService,
    private userService: UserService,
    private roleService: RoleService,
    private regionService: RegionService) { }

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail() {
    this.model = new TheaterModel();
    this.editModel = new TheaterModel();
    this.region = new RegionModel();
    this.model.workTime = [];

    this.service.getById(this.currentUser.theaterId).subscribe(theater => {
      this.model = theater;
      this.model.workTime = theater.workTime

      this.userService.getAll().subscribe(user => {
        this.staff = user.filter(u => u.theaterId === (this.currentUser.theaterId));

        this.staff.forEach(item => {
          item.lastName += ` ${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName.substring(0, 1) : ''}. (${item.phone ? item.phone : ''})`;
        });

        this.roleService.getAll().subscribe(data => this.roles = data);
      })
      this.regionService.getById(this.model.regionId).subscribe(region => this.region = region)
    });
  }

}
