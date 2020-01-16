import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SearchDialogComponent } from '../../shared/dialogs/search-dialog/search-dialog.component';

import { GameService } from '../../providers/game.service';
import { UserService } from '../../providers/user.service';

import { Game } from '../../models/game';
import { SearchForm } from '../../models/search';
import { User } from '../../models/user';

import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  games: Game[]; gameMeth = GameMethods;
  gamesFiltered: Game[]; userFiltered: User[];
  searchType: string; filters: SearchForm = {};

  constructor(private gameService: GameService, private userService: UserService, private dialog: MatDialog) {
    this.initGameList();
    this.filterUser({});
  }

  initGameList() {
    this.gameService.getAllGames().then(response => {
      this.games = response;
    });
  }

  getGameList() {
    return (Object.keys(this.filters).length > 0) ? this.gamesFiltered : this.games;
  }

  openSearchDialog() {
    console.log("filters", this.filters);
    if (this.searchType) { this.filters.type = this.searchType; }
    let searchDialog = this.dialog.open(SearchDialogComponent, {panelClass: 'mat-dialog-toolbar', data: this.filters});
    let sub = searchDialog.beforeClose().subscribe((response: SearchForm) => {
      sub.unsubscribe();
        this.searchType = response.type; delete response.type;
        this.filters = response;
        if (this.searchType == 'user') {
          this.filterUser(response);
        } else {
          this.filterGame(response);
        }
    });
  }

  private filterUser(filters: SearchForm) {
    this.userFiltered = [];
    this.userService.searchUser(filters.nickname).then(response => {
      this.userFiltered = response;
    }).catch(err => console.error(err))
  }

  private filterGame(filters: SearchForm) {
    this.gamesFiltered = [];
    if (Object.keys(filters).length > 0) {
      for (const game of this.games) {
        if (this.applyFilter(game, filters)) {
          this.gamesFiltered.push(game);
        }
      }
    }
  }

  private applyFilter(game: Game, filters: SearchForm): boolean {
    let addGame: boolean;
    for (const filter of Object.keys(filters)) {
      if (filter == 'name' || filter == 'game_code') {
        addGame = game[filter].toLowerCase().includes(filters[filter].toLowerCase());
      } else if (filter == 'platform' || filter == 'region') {
        addGame = (filters[filter].indexOf(game[filter]) > -1);
      } else if (filter == 'genres' && game.genres) {
        for (const genre of filters[filter]) {
          addGame = (game.genres.indexOf(genre) > -1);
          if (addGame) { break; }
        }
      }
    }
    return addGame;
  }
}
