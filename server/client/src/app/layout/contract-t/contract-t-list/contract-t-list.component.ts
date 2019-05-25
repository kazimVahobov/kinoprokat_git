import { Component, OnInit } from '@angular/core';
import { RoleService, UserService, PermissionService } from "../../../core";

@Component({
  selector: 'app-contract-t-list',
  templateUrl: './contract-t-list.component.html',
  styleUrls: ['./contract-t-list.component.scss']
})
export class ContractTListComponent implements OnInit {

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
  isCreate = false;

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) { }

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

    if (this.permissionService.contractDist) {
      // for (let i = 0; i < this.permissionService.contractDist.length; i++) {
      //   if (this.permissionService.contractDist[i].value === 0) {
      //     this.isCreate = true;
      //   }
      // }
      if (this.permissionService.contractTheater) {
        for (let i = 0; i < this.permissionService.contractTheater.length; i++) {
          if (this.permissionService.contractTheater[i].value === 0) {
            this.isCreate = true;
          }
        }
      }
    }

  }
}
