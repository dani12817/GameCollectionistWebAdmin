import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';

import { GameMethods } from '../game-methods';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: User; gameMeth = GameMethods;
  friendType: string;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    if (this.authService.userLogged.uid === this.user.uid) {
      this.friendType = 'me';
    } else if (this.authService.userLogged.friends.findIndex(friend => friend.uid === this.user.uid) > -1) {
      this.friendType = 'friend';
    } else { this.friendType = 'none'; }
  }

  getIconFriendButtonTooltip(): string {
    switch (this.friendType) {
      case 'me':
        return 'Mi Perfil';
      case 'friend':
        return 'Eliminar amigo';
      case 'pending':
        return 'Eliminar petición de amistad';
      default:
        return 'Enviar petición de amistad';
    }
  }

  getIconFriendButton(): string {
    switch (this.friendType) {
      case 'me':
        return 'person';
      case 'friend':
        return 'person_add_disabled';
      case 'pending':
        return 'person_outline';
      default:
        return 'person_add';
    }
  }

  getIconFriendButtonColor(): string {
    switch (this.friendType) {
      case 'me':
        return 'grey';
      case 'friend':
        return '#673ab0';
      case 'pending':
        return '#FFB02F';
      default:
        return 'red';
    }
  }

  friendButtonFuction() {
    switch (this.friendType) {
      case 'friend':
        this.userService.removeUserFromFriends(this.user);
        this.friendType = 'none';
        break;
      case 'pending':
        break;
      default:
        this.userService.addUserToFriends(this.user);
        this.friendType = 'friend';
        break;
    }
  }
}
