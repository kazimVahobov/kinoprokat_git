import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-dash-rkm *ngIf="userService.role.typeOfRole === 0"></app-dash-rkm>
    <app-dash-dist *ngIf="userService.role.typeOfRole === 1"></app-dash-dist>
    <app-dash-theater *ngIf="userService.role.typeOfRole === 2"></app-dash-theater>
    <app-dash-guest *ngIf="userService.role.typeOfRole === 4 || userService.role.typeOfRole === 3"></app-dash-guest>`
})
export class DashboardComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit() {
  }
}
