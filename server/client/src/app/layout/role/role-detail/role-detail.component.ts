import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RoleModel, RoleService, PermissionService} from 'src/app/core';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {

  id: string;
  model: RoleModel;
  roleTypes: RoleType[];
  selectedRole: number;
  roleName: string;

  constructor(private service: RoleService,
              private route: ActivatedRoute,
              private permissionService: PermissionService) {
  }

  ngOnInit() {
    this.roleTypes = this.permissionService.roleTypes;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(role => {
          this.selectedRole = role.typeOfRole;
          this.roleName = role.name;
          for (let i = 0; i < role.permissions.length; i++) {
            this.roleTypes[this.selectedRole].groups.forEach(item => {
              item.permissions.forEach(j => {
                if (j.value === role.permissions[i].value && j.groupName === role.permissions[i].groupName) {
                  j.checked = true;
                }
              });
              if (!item.permissions.some(i => !i.checked)) {
                item.checked = true;
              }
            });
          }
        });
      }
    });
  }

  shortName(label: string): string {
    if (label.includes('Относительно договоров')) {
      return label.replace('Относительно ', '...');
    } else {
      return label;
    }
  }

  checkOnStepTwo(i: number): boolean {
    return this.roleTypes[this.selectedRole].groups[i].permissions.some(i => i.checked);
  }
}

class RoleType {
  code: number;
  label: string;
  description: string;
  groups = [];
}
