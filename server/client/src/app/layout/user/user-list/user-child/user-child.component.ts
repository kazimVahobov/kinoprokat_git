import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DistributorModel,
  DistributorService,
  PagerService,
  RoleModel,
  RoleService,
  TheaterModel,
  TheaterService,
  UserModel,
  UserService,
  PermissionService
} from 'src/app/core';
import { ModalDirective } from "ngx-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-child',
  templateUrl: './user-child.component.html',
  styleUrls: ['./user-child.component.scss']
})
export class UserChildComponent implements OnInit {

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
  currentDistributor: DistributorModel = new DistributorModel();
  currentTheater: TheaterModel = new TheaterModel();
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
    private theaterService: TheaterService,
    private distributorService: DistributorService,
    private permissionService: PermissionService
  ) {
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
      this.distributorService.getAll().subscribe(distributors => {
        this.theaterService.getAll().subscribe(theaters => {
          this.currentDistributor = distributors.find(i => i._id === this.currentUser.distId);
          if (this.currentDistributor) {
            this.theaters = theaters.filter(i => i.distId === this.currentDistributor._id);
            if (this.currentDistributor.parentId) {
              this.userList = users.filter(i => i.distId === this.currentDistributor._id);
            } else {
              this.distributors = distributors.filter(i => i.parentId === this.currentDistributor._id);
              this.distributors.forEach(distributor => {
                for (let i = 0; i < users.length; i++) {
                  if (users[i].distId === distributor._id) {
                    this.userList.push(users[i]);
                  }
                }
              });
            }
            this.theaters.forEach(theater => {
              for (let i = 0; i < users.length; i++) {
                if (users[i].theaterId === theater._id) {
                  this.userList.push(users[i]);
                }
              }
            });
          } else {
            this.currentTheater = theaters.find(i => i._id === this.currentUser.theaterId);
            this.theaters = theaters.filter(i => i._id === this.currentTheater._id);
            this.userList = users.filter(i => i.theaterId === this.currentTheater._id);
          }
          this.userList.reverse();
          this.roleService.getAll().subscribe(data => this.roles = data);
          this.setPage(1);
        });
      });
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.userList.length, page);
    this.pagedItems = this.userList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
