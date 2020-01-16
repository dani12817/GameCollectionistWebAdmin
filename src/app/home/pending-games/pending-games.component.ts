import { Component } from '@angular/core';

import { GameService } from '../../providers/game.service';

import { Game } from '../../models/game';

import { platforms } from '../../shared/constant';

@Component({
  selector: 'app-pending-games',
  templateUrl: './pending-games.component.html',
  styleUrls: ['./pending-games.component.scss']
})
export class PendingGamesComponent {
  games: Game[];

  constructor(private gameService: GameService) {
    this.initGameList();
  }

  initGameList() {
    this.gameService.getAllGames(true).then(response => {
      this.games = response;
    });
  }
}
