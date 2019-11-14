import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../providers/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  authUser: User;

  constructor(private route: ActivatedRoute, public authService: AuthService) {
    this.route.data.subscribe((routeData: {authUser: User}) => {
      this.authUser = routeData.authUser;
    });
  }
}
