import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.userService.editUser();
  }
  clear() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
}
