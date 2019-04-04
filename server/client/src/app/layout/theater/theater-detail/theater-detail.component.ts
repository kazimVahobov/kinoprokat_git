import {Component, OnInit} from '@angular/core';
import {TheaterService, TheaterModel, UserModel, UserService, RoleService, RoleModel, RegionModel, RegionService} from 'src/app/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-view-holes',
  templateUrl: './theater-detail.component.html',
  styleUrls: ['./theater-detail.component.scss']
})
export class TheaterDetailComponent implements OnInit {

  id: string;
  model: TheaterModel;
  staff: UserModel[] = [];
  roles: RoleModel[] = [];
  days = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'];
  regions: RegionModel[] = [];

  currentRole = JSON.parse(localStorage.getItem('role'));

  isRKM = false;

  constructor(private service: TheaterService,
              private userService: UserService,
              private roleService: RoleService,
              private regionsService: RegionService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.model = new TheaterModel();
    this.model.workTime = [];
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(theater => {
          this.model = theater;
          this.model.workTime = theater.workTime;
          this.userService.getAll().subscribe(user => {
            this.staff = user.filter(u => u.theaterId === this.id);
            this.staff.forEach(item => {
              item.lastName += ` ${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName.substring(0, 1) : ''}. (${item.phone ? item.phone : ''})`;
            });
            this.roleService.getAll().subscribe(data => {
              this.roles = data;
              this.regionsService.getAll().subscribe(regions => this.regions = regions);
            });
          })
        });
      }
    });
    if (this.currentRole.typeOfRole === 0) {
      this.isRKM = true;
    }
  }

  backToList() {
    this.location.back();
  }
}
