import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService, RoleModel, PermissionService, UserService, UserModel } from 'src/app/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  roles: RoleModel[];
  users: UserModel[];

  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;

  isEdit = false;
  isDelete = false;
  isCreate = false;

  roleForDelete: RoleModel = new RoleModel();

  constructor(
    private service: RoleService,
    private userService: UserService,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
    this.getAllRoles();

    if (this.permissionService.roles) {
      for (let i = 0; i < this.permissionService.roles.length; i++) {
        if (this.permissionService.roles[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.roles[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.roles[i].value === 0) {
          this.isCreate = true;
        }
      }
    }

  }

  getAllRoles() {
    this.roles = [];
    this.service.getAll().subscribe(data => {
      data.forEach(element => {
        if(element.name != 'Guest Movie Role' && element.name != 'Static Role'){
          this.roles.push(element)
        }
      });
      this.roles = this.roles.reverse()
    });
  }

  openModal(role: RoleModel) {
    this.userService.getAll().subscribe(users => {
      this.users = users.filter(u => u.roleId === role._id)
      this.roleForDelete = role;
      if (this.users.length) {
        this.canNotDeleteModal.show();
      } else {
        this.deleteRole(role);
      }
    });
  }

  closeModal() {
    this.canNotDeleteModal.hide();
  }

  deleteRole(role: RoleModel) {
    if (confirm(`Вы уверен, что хотите удалить роль ${role.name}?`)) {
      this.service.delete(role._id).subscribe(res => this.getAllRoles())
    }
  }
}
