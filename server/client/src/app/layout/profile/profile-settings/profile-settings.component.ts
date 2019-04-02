import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/core';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {


  constructor(public userService: UserService) {}
  ngOnInit() {
    this.userService.editUser();
  }
}
