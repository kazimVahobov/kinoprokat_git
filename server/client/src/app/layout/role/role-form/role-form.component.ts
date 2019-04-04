import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService, PermissionService, RoleModel} from 'src/app/core';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnDestroy {

  model: RoleModel = new RoleModel();
  roleTypes: RoleType[];
  permissions: RoleType[];
  roleName: string;
  mainLabel = 'Новая роль';
  id: string;
  selectedRole: number;
  step = 0;
  typesDisable: boolean[] = [true, true, true, true];

  constructor(private service: RoleService,
              private router: Router,
              private route: ActivatedRoute,
              private permissionService: PermissionService) {
  }

  ngOnDestroy(): void {
    this.roleTypes = [];
  }

  ngOnInit() {
    this.roleTypes = this.permissionService.roleTypes;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(role => {
          this.loadPermissions();
          this.mainLabel = 'Редактирование данных';
          this.selectedRole = role.typeOfRole;
          this.roleName = role.name;
          for (let i = 0; i < this.typesDisable.length; i++) {
            if (i !== this.selectedRole) {
              this.typesDisable[i] = false;
            }
          }
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

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/role']);
    }
  }

  loadPermissions() {
    this.roleTypes.forEach(item => item.groups.forEach(i => i.permissions.forEach(j => j.checked = false)));
    this.roleTypes.forEach(item => item.groups.forEach(i => i.checked = false));
    // this.roleTypes.find(i => i.code === 3).groups.forEach(j => j.permissions = j.permissions.filter(k => k.value === 1));
  }

  checkAllChange(i: number) {
    this.roleTypes[this.selectedRole].groups[i].permissions.forEach(item => item.checked = this.roleTypes[this.selectedRole].groups[i].checked);
  }

  isIntedeterminate(i: number): boolean {
    return this.roleTypes[this.selectedRole].groups[i].permissions.some(item => item.checked) && this.roleTypes[this.selectedRole].groups[i].permissions.some(item => !item.checked);
  }

  permissionChange(i: number, j: number) {
    if (this.roleTypes[this.selectedRole].groups[i].permissions[j].value !== 1) {
      this.roleTypes[this.selectedRole].groups[i].permissions.find(item => item.value === 1).checked = this.roleTypes[this.selectedRole].groups[i].permissions.some(item => item.checked && item.value !== 1);
    }
    this.roleTypes[this.selectedRole].groups[i].checked = this.roleTypes[this.selectedRole].groups[i].permissions.some(item => item.checked);
  }

  disableOfRead(i: number, j: number): boolean {
    if (this.roleTypes[this.selectedRole].groups[i].permissions[j].value === 1) {
      return this.roleTypes[this.selectedRole].groups[i].permissions.some(item => item.checked && item.value !== 1);
    } else {
      return false;
    }
  }

  validation(): boolean {
    let result: boolean;
    if (this.selectedRole === undefined) {
      result = false;
    }
    if (!this.roleName) {
      result = false;
    } else {
      if (this.roleTypes[this.selectedRole].groups.find(item => item.permissions.some(i => i.checked))) {
        result = true;
      }
    }
    return result;
  }

  nextStep() {
    if (this.id) {
      this.model._id = this.id;
    }
    this.model.name = this.roleName;
    this.model.typeOfRole = this.selectedRole;
    this.model.permissions = [];
    for (let i = 0; i < this.roleTypes[this.selectedRole].groups.length; i++) {
      this.roleTypes[this.selectedRole].groups[i].permissions.forEach(j => {
        if (j.checked) {
          const temp = {
            value: j.value,
            groupName: j.groupName
          };
          this.model.permissions.push(temp);
        }
      });
    }
    this.mainLabel = 'Проверьте и подтвердите';
    this.step = 1;
  }

  submit() {
    this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/role']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  prevStep() {
    if (this.id) {
      this.mainLabel = 'Редактирование данных';
    } else {
      this.mainLabel = 'Новая роль';
    }
    this.step = 0;
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
  groups: Permission[] = [];
}

class Permission {
  checked: boolean;
  label: string;
  permissions: Permissions[];
}

class Permissions {
  label: string;
  description: string;
  value: number;
  checked: boolean;
  groupName: string;
}
