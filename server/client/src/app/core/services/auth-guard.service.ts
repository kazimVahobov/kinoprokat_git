import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private permissionService: PermissionService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.permissionService.userActivePermission();
    const routerArray = ['/user', '/rkm-report', '/distributor-report', '/region', '/theater-report', '/theater', '/movie', '/distributor', '/role', '/cont-f', '/cont-s', '/cont-t','/statistic'];
    const permissionArray = [this.permissionService.userRead, this.permissionService.reportRKMRead, this.permissionService.reportDistRead, this.permissionService.regionRead,
    this.permissionService.reportTheaterRead, this.permissionService.theaterRead, this.permissionService.movieRead, this.permissionService.distributorRead,
    this.permissionService.roleRead, this.permissionService.contractRKMRead, this.permissionService.contractDistRead, this.permissionService.contractTheaterRead, true];
    for (let i = 0; i < 13; i++) {
      if (routerArray[i] === state.url) {
        if (permissionArray[i] === true) {
            return true;
        } else {
          this.router.navigate(['/not-found'], {
            queryParams: {
              accessDenied: true
            }
          });
          return false;
        }
      }
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

}
