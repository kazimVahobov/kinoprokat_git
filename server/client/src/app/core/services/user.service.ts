import {Injectable} from '@angular/core';
import {EntityService} from './base';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UserModel, RoleModel, DistributorModel} from '../models';
import {AuthService} from './auth.service';
import {RoleService} from './role.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends EntityService<UserModel> {

  userId: string;
  user: UserModel;
  ImagePreview = '/assets/img/noavatar.png';
  role: RoleModel;
  distriburtor: DistributorModel;

  constructor(http: HttpClient,
              private service: AuthService,
              private roleService: RoleService,
              private permissionService: PermissionService) {
    super('user', http);
  }

  login(userName: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post(url, {userName: userName, password: password});
  }

  create(model: UserModel): Observable<UserModel> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<UserModel>(url, model);
  }

  changePassword(model: UserModel): Observable<UserModel> {
    const url = `${this.baseUrl}/changePass`;
    return this.http.post<UserModel>(url, model);
  }

  droppingPassword(model: UserModel): Observable<UserModel> {
    const url = `${this.baseUrl}/droppingPass`;
    return this.http.post<UserModel>(url, model);
  }

  createImage(_id: string, image: File): Observable<UserModel> {
    const fd = new FormData();
    fd.append('image', image, image.name);
    const url = `${this.baseUrl}/${_id}`;
    return this.http.put<UserModel>(url, fd);
  }

  editUser() {
    this.user = new UserModel();
    this.role = new RoleModel();
    this.distriburtor = new DistributorModel();
    this.userId = this.service.currentUserId;
    this.getById(this.userId).subscribe(user => {
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
        this.roleGetById(this.user.roleId);
      if (this.user.imageSrc) {
        this.ImagePreview = `${environment.apiUrl}/${this.user.imageSrc}`;
      } else {
        this.ImagePreview = 'assets/img/noavatar.png';
      }
    });
  }

  roleGetById(id: string) {
    this.roleService.getById(id).subscribe(role => {
      this.role = role;
      window.localStorage.setItem('role', JSON.stringify(role));
      this.permissionService.userActivePermission();
    });
  }
}
