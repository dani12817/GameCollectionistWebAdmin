import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';


@Injectable({
  providedIn: 'root'
})
export class UserDataResolverService implements Resolve<User> {
  constructor(private userServ: UserService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<User> {
    return this.userServ.getUser(route.paramMap.get('nickname'), (route.url[0].path === 'user-data'));
  }
}
