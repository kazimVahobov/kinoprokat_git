import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  TheaterService,
  UserService,
  RoleService,
  UserModel,
  DistributorService,
  RoleModel,
  TheaterModel,
  DistributorModel
} from 'src/app/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  id: string;

  mainLabel = 'Новый пользователь';
  passError = false;
  userNameError = false;

  model: UserModel;
  distRoles: RoleModel[];
  theaterRoles: RoleModel[];
  guestRoles: RoleModel[];
  distributors: DistributorModel[];
  theaters: TheaterModel[];
  confirmPassword: string;

  userMode: number;
  typeOfUser: number;
  showDist = true;
  showTheater = true;
  showGuest = true;
  disableDistRoles = true;
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: UserService,
              private roleService: RoleService,
              private theaterService: TheaterService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {
    this.model = new UserModel();
    this.roleService.getAll().subscribe(roles => {
      this.theaterRoles = roles.filter(item => item.typeOfRole == 2);
      this.guestRoles = roles.filter(item => item.typeOfRole === 3)
    });
    this.roleService.getById(this.currentUser.roleId).subscribe(role => this.setUserMode(role.typeOfRole, this.currentUser));
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(user => {
          this.mainLabel = 'Редактирование данных пользователя';
          this.model = user;
          this.confirmPassword = this.model.password;
          if(user.roleId) {
          this.roleService.getById(user.roleId).subscribe(role => {
            switch (role.typeOfRole) {
              case 0:
              case 1: {
                this.showTheater = false;
                this.showGuest = false;
                this.changeDist();
                this.userMode = 0;
                break;
              }
              case 2: {
                this.showDist = false;
                this.showGuest = false;
                this.userMode = 1;
                break;
              }
              case 3: {
                this.showDist = false;
                this.showTheater = false;
                this.userMode = 2;
                break;
              }
              case 4: {
                this.showDist = false;
                this.showTheater = false;
                this.showGuest = false;
                this.userMode = null;
                break;
              }
            }
          });
        } else {
          this.showDist = false;
          this.showTheater = false;
          this.showGuest = false;
        }
        });
      }
    });
  }

  setUserMode(type: number, user: UserModel) {
    this.typeOfUser = type;
    switch (type) {
      case 0: {
        this.userMode = 0;
        this.distributorService.getAll().subscribe(distributors => {
          this.distributors = distributors.filter(item => item._id === user.distId || item.parentId === user.distId);
        });
        this.theaterService.getAll().subscribe(theaters => this.theaters = theaters.filter(item => item.distId === user.distId));
        break;
      }
      case 1: {
        this.userMode = 0;
        this.showGuest = false;
        this.distributorService.getAll().subscribe(distributors => {
          this.distributors = distributors.filter(item => item._id === user.distId);
          if (this.distributors.length === 1) {
            this.model.distId = this.distributors[0]._id;
          }
        });
        this.roleService.getAll().subscribe(roles => this.distRoles = roles.filter(item => item.typeOfRole === 1));
        this.theaterService.getAll().subscribe(theaters => this.theaters = theaters.filter(item => item.distId === user.distId));
        this.disableDistRoles = false;
        break;
      }
      case 2: {
        this.userMode = 1;
        this.showDist = false;
        this.showGuest = false;
        this.theaterService.getAll().subscribe(theaters => {
          this.theaters = theaters.filter(item => item._id === user.theaterId);
          if (this.theaters.length === 1) {
            this.model.theaterId = this.theaters[0]._id;
          }
        });
        break;
      }
    }
  }

  changeDist() {
    this.disableDistRoles = false;
    this.model.roleId = null;
    if (this.distributors.find(i => i._id === this.model.distId && !i.parentId)) {
      this.roleService.getAll().subscribe(data => {
        this.distRoles = [];
        data.forEach(element => {
          if(element.name != 'Guest Movie Role' && element.name != 'Static Role' && element.typeOfRole === 0){
            this.distRoles.push(element)
          }
        });
        this.distRoles = this.distRoles.reverse()
      });
    } else {
      this.roleService.getAll().subscribe(roles => this.distRoles = roles.filter(item => item.typeOfRole === 1));
    }
  }

  changeUserMode() {
    this.model.roleId = null;
  }

  validation(): boolean {
    let result;
    if (!this.model.firstName || !this.model.lastName || !this.model.userName || !this.model.password || !this.confirmPassword) {
      result = false;
    } else if (this.userMode === 0) {
      result = !(!this.model.distId || !this.model.roleId);
    } else if (this.userMode === 1) {
      result = !(!this.model.theaterId || !this.model.roleId);
    } else if (this.userMode === 2) {
      result = this.model.roleId;
    }
    return result;
  }


  submit() {
    this.passError = false;
    this.userNameError = false;
    switch (this.userMode) {
      case 0: {
        this.model.theaterId = null;
        break;
      }
      case 1: {
        this.model.distId = null;
        break;
      }
      case 2: {
        this.model.theaterId = null;
        this.model.distId = null;
        break;
      }
    }
    if (this.model.password === this.confirmPassword) {
      if (this.model._id) {
        this.service.update(this.model).subscribe(res => {
            alert('Все изменения успешно сохранены');
            this.router.navigate(['/user']);
          },
          error => {
            if (error.error.message === 'Такой login уже занят') {
              this.userNameError = true;
            }
          });
      } else {
        this.service.create(this.model).subscribe(res => {
            alert('Новый пользователь успешно сохранён');
            this.router.navigate(['/user']);
          },
          error => {
            if (error.error.message === 'Такой login уже занят') {
              this.userNameError = true;
            }
          });
      }
    } else {
      this.passError = true;
    }
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/user']);
    }
  }
}
