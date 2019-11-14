import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Game } from '../../models/game';
import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';
import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-game-library',
  templateUrl: './game-library.component.html',
  styleUrls: ['./game-library.component.scss']
})
export class GameLibraryComponent {
  userGamesLibrary = {}; gameMeth = GameMethods;
  gamePlatformSelected: Game[];

  constructor(private userService: UserService, private authService: AuthService, private snackbar: MatSnackBar) {
    this.initializeLibrary();
  }

  async initializeLibrary() {
    for (const game of this.authService.userLogged.games) {
      await game.reference.get().then(res => {
        let gameData = res.data();
        if (this.userGamesLibrary[gameData.platform] !== undefined) {
          this.userGamesLibrary[gameData.platform].push(gameData);
        } else { this.userGamesLibrary[gameData.platform] = [gameData]; }
      })
    }
    console.log("userGamesLibrary", this.userGamesLibrary);
  }

  objectKeys(data): string[] {
    return Object.keys(data);
  }

  selectGamePlatform(platform: string) {
    this.gamePlatformSelected = this.userGamesLibrary[platform];
  }
}
