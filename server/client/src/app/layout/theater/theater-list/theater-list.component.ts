import { Component, OnInit } from '@angular/core';
import { UserService, RoleService, PermissionService } from 'src/app/core';

@Component({
  selector: 'app-theater-list',
  templateUrl: './theater-list.component.html',
  styleUrls: ['./theater-list.component.scss']
})
export class TheaterListComponent implements OnInit {

  roleType: number;
  modes = [
    {
      value: 0,
      name: 'Все'
    },
    {
      value: 1,
      name: 'Дочерние'
    }
  ];
  currentMode: number;
  currentUser = JSON.parse(localStorage.getItem('user'));

  isCreated = false;

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
    this.roleService.getById(this.currentUser.roleId).subscribe(role => {
      this.roleType = role.typeOfRole;
      switch (this.roleType) {
        case 0:
        case 3: {
          this.currentMode = 0;
          break;
        }
        case 1:
        case 2: {
          this.currentMode = 1;
          break;
        }
      }
    });

    if (this.permissionService.theaters) {
      for (let i = 0; i < this.permissionService.theaters.length; i++) {
        if (this.permissionService.theaters[i].value === 0) {
          this.isCreated = true;
        }
      }
    }
  }
}
