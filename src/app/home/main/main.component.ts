import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SearchDialogComponent } from '../../shared/dialogs/search-dialog/search-dialog.component';

import { GameService } from '../../providers/game.service';
import { UserService } from '../../providers/user.service';
import { LoadingService } from '../../providers/loading.service';
import { FilterService } from '../../providers/filter.service';

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
  searchType: string;

  constructor(private gameService: GameService, private userService: UserService, private dialog: MatDialog, public loading: LoadingService,
  private filterService: FilterService) {
    this.initGameList();
    this.filterUser();
  }

  initGameList() {
    this.loading.isLoading = true;
    this.gameService.getAllGames().then(response => {
      this.games = response;
      this.filterGame();
    });
  }

  getGameList() {
    return (Object.keys(this.filterService.filters).length > 1) ? this.gamesFiltered : this.games;
  }

  openSearchDialog() {
    if (this.searchType) { this.filterService.filters.type = this.searchType; }
    const searchDialog = this.dialog.open(SearchDialogComponent, {panelClass: 'mat-dialog-toolbar', autoFocus: false});
    searchDialog.beforeClosed().subscribe(() => {
      this.loading.isLoading = true;
      this.searchType = this.filterService.filters.type;

      if (this.searchType === 'user') {
        this.filterUser();
      } else {
        this.filterGame();
      }
    });
  }

  private filterUser() {
    this.userFiltered = [];
    this.userService.searchUser(this.filterService.filters.nickname).then(response => {
      this.userFiltered = response;
      this.loading.isLoading = false;
    }).catch(err => console.error(err));
  }

  private filterGame() {
    this.gamesFiltered = [];
    if (Object.keys(this.filterService.filters).length > 1) {
      for (const game of this.games) {
        if (this.applyFilter(game, this.filterService.filters)) {
          this.gamesFiltered.push(game);
        }
      }
    }
    this.loading.isLoading = false;
  }

  private applyFilter(game: Game, filters: SearchForm): boolean {
    let addGame: boolean;
    for (const filter of Object.keys(filters)) {
      if (filter === 'name' || filter === 'game_code') {
        addGame = game[filter].toLowerCase().includes(filters[filter].toLowerCase());
      } else if (filter === 'platform' || filter === 'region') {
        addGame = (filters[filter].indexOf(game[filter]) > -1);
      } else if (filter === 'genres' && game.genres) {
        for (const genre of filters[filter]) {
          addGame = (game.genres.indexOf(genre) > -1);
          if (addGame) { break; }
        }
      }
    }
    return addGame;
  }
}
