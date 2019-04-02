import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  DistributorModel,
  TheaterModel,
  UserModel,
  DistributorService,
  TheaterService,
  UserService,
  RoleModel,
  RoleService,
  RegionService,
  RegionModel
} from 'src/app/core';

@Component({
  selector: 'app-distributor-detail',
  templateUrl: './distributor-detail.component.html',
  styleUrls: ['./distributor-detail.component.scss']
})
export class DistributorDetailComponent implements OnInit {

  id: string;
  model: DistributorModel = new DistributorModel();
  parent: DistributorModel = new DistributorModel();
  director: UserModel = new UserModel();
  theaters: TheaterModel[] = [];
  users: UserModel[] = [];
  staff: UserModel[] = [];
  roles: RoleModel[] = [];
  regions: RegionModel[] = [];

  constructor(private service: DistributorService,
              private regionService: RegionService,
              private userService: UserService,
              private theaterService: TheaterService,
              private roleService: RoleService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getAll().subscribe(distributors => {
          this.regionService.getAll().subscribe(regions => {
            this.regions = regions;
            this.model = distributors.find(item => item._id === this.id);
            if (this.model.parentId) {
              this.parent = distributors.find(item => item._id === this.model.parentId);
            }
            this.userService.getAll().subscribe(users => {
              users.forEach(item => {
                item.lastName += ` ${item.firstName ? item.firstName : ''} ${item.middleName ? item.middleName.substring(0, 1) : ''}. (${item.phone ? item.phone : ''})`;
              });
              this.staff = users.filter(item => item.distId === this.model._id);
              this.users = users;
              this.theaterService.getAll().subscribe(theaters => {
                this.theaters = theaters.filter(item => item.distId === this.model._id);
              });
              this.roleService.getAll().subscribe(roles => this.roles = roles);
            });
          });
        });
      }
    });
  }
}
