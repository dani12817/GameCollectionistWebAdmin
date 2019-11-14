import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from "@angular/router";

import { AuthService } from '../providers/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Promise<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.getLoggedInUser().then(response => {
        if (response) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      }).catch(error => {
        this.router.navigate(['/login']);
        reject(false);
      });
    });
  }
}
