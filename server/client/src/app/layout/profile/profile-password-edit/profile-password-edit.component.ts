import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService, UserModel} from 'src/app/core';

@Component({
  selector: 'app-edit-password',
  templateUrl: './profile-password-edit.component.html',
  styleUrls: ['./profile-password-edit.component.scss']
})
export class ProfilePasswordEditComponent implements OnInit {

  passError = false;
  oldPassError = false;
  newPassError = false;
  model: UserModel;
  userForm: FormGroup;
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.model = new UserModel();
    this.userService.getById(this.currentUser._id).subscribe(user => {
      this.model = user;
    });
    this.userForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      repeatPassword: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.validReset(false);
    if (this.userForm.controls['newPassword'].value !== this.userForm.controls['repeatPassword'].value) {
      this.passError = true;
      this.newPassError = true;
      this.formReset();
    } else {
      this.model.password = this.userForm.controls['password'].value.toString();
      this.model.newPassword = this.userForm.controls['newPassword'].value.toString();
      this.userService.changePassword(this.model).subscribe(res => {
          alert('Новый пароль успешно сохранён');
          this.formReset();
          this.validReset(false);
          this.userService.editUser();
        },
        err => {
          this.passError = true;
          this.oldPassError = true;
          this.formReset();
        });
    }
  }

  validReset(state: boolean) {
    this.passError = state;
    this.oldPassError = state;
    this.newPassError = state;
  }

  formReset() {
    this.userForm.controls['password'].reset();
    this.userForm.controls['newPassword'].reset();
    this.userForm.controls['repeatPassword'].reset();
  }
}
