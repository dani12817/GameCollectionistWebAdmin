import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";

import { Game } from "../models/game";

@Injectable({
  providedIn: "root"
})
export class GameService {
  gameCollection = this.afs.collection<Game>("games");

    constructor(private storage: AngularFireStorage, private afs: AngularFirestore) { }

    getAllGames(): Promise<Game[]> {
      return new Promise<Game[]>((resolve, reject) => {
        this.gameCollection.valueChanges().subscribe(response => {
          resolve(response);
        }, err => reject(err));
      });
    }

    getGameByGameCode(game_code: string, pending?: boolean): Promise<Game> {
      return new Promise<any>((resolve, reject) => {
        this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc<Game>(game_code).valueChanges().subscribe(response => {
          resolve(new Game(response));
        }, err => reject(err));
      });
    }

    createGame(gameData: Game, boxart): Promise<Game> {
      return this.saveWithBoxart(boxart, gameData);
    }

    private async saveWithBoxart(boxart, gameData: Game) {
      return new Promise<Game>((resolve, reject) => {
        const fileRef = this.storage.ref(`games/${gameData.game_code}.${boxart.name.split(".")[1]}`);
        const metaData = { contentType: boxart.type };
  
        fileRef.put(boxart, metaData).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            gameData.image = downloadURL;
            this.saveGameData(gameData).then(response => {
              resolve(response);
            });
            console.log("Juego Creado");
          }, err => reject(err));
        }, err => reject(err));
      });
  }

  updateGame(gameData: Game, boxart): Promise<Game> {
    if (boxart) {
      return this.saveWithBoxart(boxart, Object.assign({}, gameData));
    } else { return this.saveGameData(Object.assign({}, gameData)); }
  }
  
  private saveGameData(gameData): Promise<Game> {
    return new Promise<Game>((resolve, reject) => {
      this.gameCollection.doc(gameData.game_code).set(gameData);
      resolve(gameData);
    });
  }

  deleteGame(game_code: string, pending?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc<Game>(game_code).delete().then(() => {
        console.log("deleted", game_code);
        resolve();
      }).catch(err => reject(err));
    });
  }

  gameExist(game_code: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      this.getGameByGameCode(game_code).then(response => {
        if (response.game_code === null || response.game_code === undefined) {
          resolve(false);
        } else { resolve (true); }
      }).catch(err => reject(err));
    });
  }
}
