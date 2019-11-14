import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { platforms } from '../../shared/constant';
import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  games: Game[]; gameMeth = GameMethods;
  platforms: string[] = platforms;
  gamesFiltered: Game[]; filterActive: boolean = false;

  constructor(private afs: AngularFirestore) {
    this.initGameList();
  }

  initGameList() {
    this.afs.collection<Game>('games').valueChanges().subscribe(response => {
      this.games = response;
    });
  }

  searchGamesPlatform(platform){
    if (platform == 'Todas') {
      this.initGameList();
    } else {
      this.afs.collection<Game>('games', ref => ref.where("platform", "==", platform)).valueChanges().subscribe(response => {
        this.games = response;
      });
    }
  }

  filterGame(textFilter: string) {
    if (textFilter.trim().length > 0) {
      console.log(textFilter);
      this.gamesFiltered = [];
      for (const game of this.games) {
        if (game.name.toLowerCase().includes(textFilter.toLowerCase())) {
          this.gamesFiltered.push(game);
        }
      }
      this.filterActive = true;
      // this.games = this.afs.collection<Game>('games', ref => ref.where("namecode", ">=", textFilter)).valueChanges();
    }
  }

  getGameList() {
    return this.filterActive ? this.gamesFiltered : this.games;
  }
}
