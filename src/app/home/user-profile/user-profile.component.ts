import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../providers/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userData: User; userFriends: User[];

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.route.data.subscribe((routeData: {userData: User}) => {
      this.userData = routeData.userData;
      if (this.userData === null || this.userData === undefined) { this.router.navigate(['/']); } else { this.initializeFriends(); }
      console.log("userData", this.userData.name);
    });
  }

  private async initializeFriends() {
    this.userFriends = [];
    for (const userFriend of this.userData.friends) {
      await userFriend.reference.get().then(res => {
        let userData = res.data() as User;
        this.userFriends.push(userData);
      });
    }
    console.log("userFriends", this.userFriends);
  }
}
