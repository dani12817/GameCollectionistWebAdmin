import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Game } from '../../models/game';
import { GameMethods } from '../../shared/game-methods';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent {
  gameData: Game; gameMeth = GameMethods;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private snackbar: MatSnackBar) {
    console.log("GameDetailsComponent");
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      this.gameData = routeData.gameData;
      if (this.gameData === null || this.gameData === undefined) { this.router.navigate(['/']); }
      console.log("this.gameData", this.gameData.name);
      this.userService.gameOnLibrary(this.gameData.game_code).then(response => {
        this.gameData.game_on_library = response;
      }).catch(err => console.error(err));
    });
  }

  addGameToLibrary() {
    this.userService.addGameToLibrary(this.gameData.game_code).then(response => {
      this.snackbar.open("Juego añadido a tu biblioteca");
      this.gameData.game_on_library = true;
    }).catch(err => console.error(err));
  }

  removeGameFromLibrary() {
    this.userService.removeGameFromLibrary(this.gameData.game_code).then(response => {
      this.snackbar.open("Juego eliminado de tu biblioteca");
      this.gameData.game_on_library = false;
    }).catch(err => console.error(err));
  }
}
