import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DistributorModel,
  PagerService,
  RoleModel,
  RoleService,
  TheaterModel,
  UserModel,
  UserService,
  PermissionService
} from 'src/app/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-user-guest',
  templateUrl: './user-guest.component.html',
  styleUrls: ['./user-guest.component.scss']
})
export class UserGuestComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  passError = false;
  form = new FormGroup({
    password: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required)
  });
  userForResetPass: UserModel;
  roles: RoleModel[] = [];
  distributors: DistributorModel[] = [];
  theaters: TheaterModel[] = [];
  @ViewChild('resetPassModal') resetPassModal: ModalDirective;
  userList: UserModel[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));

  isDelete = false;
  isEdit = false;
  isEditPass = false;

  constructor(private service: UserService,
              private roleService: RoleService,
              private pagerService: PagerService,
              private permissionService: PermissionService) {
  }

  ngOnInit() {
    this.loadData();
    if (this.permissionService.users) {
      for (let i = 0; i < this.permissionService.users.length; i++) {
        if (this.permissionService.users[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.users[i].value === 5) {
          this.isEditPass = true;
        }
        if (this.permissionService.users[i].value === 3) {
          this.isDelete = true;
        }
      }
    }
  }

  deleteUser(user: UserModel) {
    if (confirm(`Вы уверены, что хотите удалить пользователя ${user.userName}?`)) {
      this.service.delete(user._id).subscribe(res => this.loadData());
    }
  }

  resetPassword(user: UserModel) {
    if (confirm(`Вы действительно хотите сбросить пароль пользователя ${user.userName}?`)) {
      this.userForResetPass = user;
      this.resetPassModal.show();
    }
  }

  closeModal() {
    this.form.controls['password'].reset();
    this.form.controls['confirmPassword'].reset();
    this.resetPassModal.hide();
  }

  updateUserPass() {
    if (this.form.controls['password'].value !== this.form.controls['confirmPassword'].value) {
      this.form.controls['password'].reset();
      this.form.controls['confirmPassword'].reset();
      this.passError = true;
    } else {
      this.userForResetPass.password = this.form.controls['password'].value.toString();
      this.service.droppingPassword(this.userForResetPass).subscribe(res => {
        alert('Новый пароль успешно сохранён');
        this.closeModal();
      });
      this.passError = false;
    }
  }

  loadData() {
    this.service.getAll().subscribe(users => {
      this.roleService.getAll().subscribe(roles => {
        this.roles = roles.filter(i => i.typeOfRole === 3);
        this.roles.forEach(role => {
          this.userList = users.filter(user => user.roleId === role._id || user.movieId);
        });
        this.userList.reverse();
        this.setPage(1);
      });
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.userList.length, page);
    this.pagedItems = this.userList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
