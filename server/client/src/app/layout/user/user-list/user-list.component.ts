import { Component, OnInit } from '@angular/core';
import { RoleService, PermissionService } from 'src/app/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  roleType: number;
  modes = [
    {
      value: 0,
      name: 'Все'
    },
    {
      value: 1,
      name: 'Дочерние'
    },
    {
      value: 2,
      name: 'Гости'
    }
  ];
  currentMode: number;
  currentUser = JSON.parse(localStorage.getItem('user'));

  isCreated = false;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
    this.roleService.getById(this.currentUser.roleId).subscribe(role => {
      this.roleType = role.typeOfRole;
      switch (this.roleType) {
        case 0: {
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
    if (this.permissionService.users) {
      for (let i = 0; i < this.permissionService.users.length; i++) {
        if (this.permissionService.users[i].value === 0) {
          this.isCreated = true;
        }
      }
    }
  }

}
