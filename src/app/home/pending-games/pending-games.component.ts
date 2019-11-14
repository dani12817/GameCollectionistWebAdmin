import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Game } from '../../models/game';
import { platforms } from '../../shared/constant';

@Component({
  selector: 'app-pending-games',
  templateUrl: './pending-games.component.html',
  styleUrls: ['./pending-games.component.scss']
})
export class PendingGamesComponent {
  games: Game[];
  platforms: string[] = platforms;

  constructor(private afs: AngularFirestore) {
    this.initGameList();
  }

  initGameList() {
    this.afs.collection<Game>('pendingGames').valueChanges().subscribe(response => {
      this.games = response;
    });
  }

  searchGamesPlatform(platform){
    if (platform == 'Todas') {
      this.initGameList();
    } else {
      this.afs.collection<Game>('pendingGames', ref => ref.where("platform", "==", platform)).valueChanges().subscribe(response => {
        this.games = response;
      });
    }
  }
}
