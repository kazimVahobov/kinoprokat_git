import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-profile-detail',
  template: `
    <app-profile-rkm *ngIf= "userService.role.typeOfRole === 0 || userService.role.typeOfRole === 1"></app-profile-rkm>
    <app-profile-theater *ngIf="userService.role.typeOfRole === 2"></app-profile-theater>`
})
export class ProfileDetailComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
