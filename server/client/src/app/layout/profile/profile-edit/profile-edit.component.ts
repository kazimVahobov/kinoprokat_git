import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService, UserModel} from 'src/app/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  model: UserModel;
  userForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.model = new UserModel();
    this.userService.getById(this.currentUser._id).subscribe(user => {
      this.model = user;
      this.createForm();
    });
  }

  createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(this.model.firstName, Validators.required),
      lastName: new FormControl(this.model.lastName, Validators.required),
      middleName: new FormControl(this.model.middleName, Validators.required),
      phone: new FormControl(this.model.phone),
      email: new FormControl(this.model.email)
    });
  }

  onSubmit() {
    this.model.lastName = this.userForm.controls['lastName'].value.toString();
    this.model.firstName = this.userForm.controls['firstName'].value.toString();
    this.model.middleName = this.userForm.controls['middleName'].value.toString();
    this.model.phone = this.userForm.controls['phone'].value.toString();
    this.model.email = this.userForm.controls['email'].value.toString();
    this.userService.update(this.model).subscribe(res => {
      alert('Все изменения успешно сохранены');
      this.userService.editUser();
    });
  }

  reset() {
    this.userForm.controls['lastName'].reset();
    this.userForm.controls['firstName'].reset();
    this.userForm.controls['middleName'].reset();
    this.userForm.controls['phone'].reset();
    this.userForm.controls['email'].reset();
  }
}
