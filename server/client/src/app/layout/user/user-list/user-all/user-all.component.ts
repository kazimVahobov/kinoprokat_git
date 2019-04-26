import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DistributorModel,
  DistributorService,
  PagerService,
  RoleModel,
  RoleService,
  TheaterModel,
  TheaterService,
  UserModel,
  UserService
} from 'src/app/core';
import {ModalDirective} from "ngx-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.scss']
})
export class UserAllComponent implements OnInit {

  pager: any = {};
  pagedItems: any[] = [];
  passError = false;
  form = new FormGroup({
    password: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required)
  });
  userForResetPass: UserModel;
  currentUserId: string;
  roles: RoleModel[] = [];
  distributors: DistributorModel[] = [];
  theaters: TheaterModel[] = [];
  @ViewChild('resetPassModal') resetPassModal: ModalDirective;
  userList: UserModel[];
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private service: UserService,
              private roleService: RoleService,
              private pagerService: PagerService,
              private theaterService: TheaterService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {
    this.currentUserId = this.currentUser._id;
    this.getAllUsers();
    this.loadRoles();
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

  getAllUsers() {
    this.service.getAll().subscribe(users => {
      this.userList = users.reverse();
      this.theaterService.getAll().subscribe(theaters => this.theaters = theaters);
      this.distributorService.getAll().subscribe(distributors => this.distributors = distributors);
      this.setPage(1);
    });
  }

  loadRoles() {
    this.roleService.getAll().subscribe(data => this.roles = data);
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.userList.length, page);
    this.pagedItems = this.userList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
