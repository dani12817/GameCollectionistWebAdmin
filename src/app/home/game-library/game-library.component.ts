import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';

import { Game } from '../../models/game';

import { GameMethods } from '../../shared/game-methods';
import { userLibraries } from '../../shared/constant';
import { UserGame } from '../../models/user';

@Component({
  selector: 'app-game-library',
  templateUrl: './game-library.component.html',
  styleUrls: ['./game-library.component.scss']
})
export class GameLibraryComponent implements OnChanges {
  @Input() userLibrary: UserGame[];
  @Input() otherUser: boolean;
  userGamesLibrary = {}; gameMeth = GameMethods; userLibraries = userLibraries;
  selectLibrary: string = 'owned';
  gamePlatformSelected: Game[];

  constructor(private authService: AuthService, private snackbar: MatSnackBar) { }

  ngOnChanges(): void {
    console.log("userLibrary", this.userLibrary);
    if (!this.otherUser) { this.userLibrary =  this.authService.userLogged.games}
    this.initializeLibrary();
  }

  async initializeLibrary() {
    this.userGamesLibrary = {};
    for (const game of this.userLibrary) {
      if (game.type === this.selectLibrary) {
        try {
          await game.reference.get().then(res => {
            let gameData = res.data();
            if (this.userGamesLibrary[gameData.platform] !== undefined) {
              this.userGamesLibrary[gameData.platform].push(gameData);
            } else { this.userGamesLibrary[gameData.platform] = [gameData]; }
          });
        } catch (err) { console.log("Not found", game.gamecode); }
      }
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
