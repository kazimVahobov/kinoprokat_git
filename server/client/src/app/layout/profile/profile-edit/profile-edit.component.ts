import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from 'src/app/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  userForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.createForm();
    this.userService.getById(this.currentUser._id).subscribe(user => {
      this.fillForm(user);
    });
  }

  createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      middleName: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null)
    });
  }

  fillForm(model: any) {
    this.userForm.controls['firstName'].setValue(model.firstName);
    this.userForm.controls['lastName'].setValue(model.lastName);
    this.userForm.controls['middleName'].setValue(model.middleName);
    this.userForm.controls['phone'].setValue(model.phone);
    this.userForm.controls['email'].setValue(model.email);
  }

  onSubmit() {
    let model: any = {};
    model._id = this.currentUser._id;
    model.lastName = this.userForm.controls['lastName'].value.toString();
    model.firstName = this.userForm.controls['firstName'].value.toString();
    if (this.userForm.controls['middleName'].value) {
      model.middleName = this.userForm.controls['middleName'].value.toString();
    }
    if (this.userForm.controls['phone'].value) {
      model.phone = this.userForm.controls['phone'].value.toString();
    }
    if (this.userForm.controls['email'].value) {
      model.email = this.userForm.controls['email'].value.toString();
    }
    this.userService.update(model).subscribe(res => {
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
