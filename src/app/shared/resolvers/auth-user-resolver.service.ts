import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthUserResolverService implements Resolve<User> {
  constructor(private authService: AuthService, private router: Router) { }

  resolve(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.authService.getLoggedInUser().then(loggedInUser => {
        resolve(loggedInUser);
      }).catch(error => {
        console.error('getLoggedInUser', error);
        reject(error);
      });
    });
  }
}
