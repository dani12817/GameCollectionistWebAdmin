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

  getAllGames(pending?: boolean): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      let sub = this.afs.collection<Game>(pending ? 'pendingGames' : 'games', ref => ref.orderBy('platform')).valueChanges().subscribe(response => {
        sub.unsubscribe();
        resolve(response);
      }, err => reject(err));
    });
  }

  /*getAllPlatformGames(platform: string, pending?: boolean): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      let sub = this.afs.collection<Game>(pending ? 'pendingGames' : 'games', ref => ref.where("platform", "==", platform).orderBy('platform')).valueChanges().subscribe(response => {
        sub.unsubscribe();
        resolve(response);
      }, err => reject(err));
    });
  }*/

  getGameByGameCode(game_code: string, pending?: boolean): Promise<Game> {
    return new Promise<any>((resolve, reject) => {
      let sub = this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc<Game>(game_code).valueChanges().subscribe(response => {
        sub.unsubscribe();
        resolve(new Game(response));
      }, err => reject(err));
    });
  }
  
  getGameImageByGameCode(game_code: string): Promise<string> {
    return this.storage.storage.ref(`/games/${game_code}`).getDownloadURL()
  }    

  createGame(gameData: Game, boxart, pending: boolean): Promise<Game> {
    if (boxart) {
      return this.saveWithBoxart(Object.assign({}, gameData), boxart, pending);
    } else { return this.saveGameData(Object.assign({}, gameData)); }
  }

  private saveWithBoxart(gameData: Game, boxart, pending: boolean) {
	  return new Promise<any>((resolve, reject) => {
  		const fileRef = this.storage.ref(`games/${gameData.game_code}`);
      const metaData = { contentType: boxart.type };
      console.log("saveWithBoxart", gameData, boxart, pending);
  
  		fileRef.put(boxart, metaData).then(snapshot => {
        console.log("put");
  		  snapshot.ref.getDownloadURL().then(downloadURL => {
    			gameData.image = downloadURL;
    			gameData.namecode = this.generateNameCode(gameData.name);
    			this.afs.collection<Game>(pending ? 'pendingGames' : 'games').doc(gameData.game_code).set(gameData);
    			resolve(gameData);
  		  }).catch(err => reject(err));
  		}).catch(err => reject(err));
	  });
  }

  private generateNameCode(name: string): string {
    name = name.toLowerCase();
    name = name.replace('(', '').replace(')', '').replace('.', '').replace(',', '').replace('!', '').replace('?', '').replace(':', '').replace('/', '').replace('\'', '');
    return name;
  }

  updateGame(gameData: Game, boxart): Promise<Game> {
    if (boxart) {
      return this.saveWithBoxart(Object.assign({}, gameData), boxart, false);
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

  gameExist(game_code: string): Promise<{error?: string, exist: boolean}> {
    return new Promise<{error?: string, exist: boolean}>((resolve, reject) => {
      this.getGameByGameCode(game_code).then(response => {
        if (response.game_code === null || response.game_code === undefined) {
          this.getGameByGameCode(game_code, true).then(response => {
            if (response.game_code === null || response.game_code === undefined) {
              resolve({exist: false});
            } else { resolve ({error: 'El juego está pendiente de aprobación', exist: true}); }
          }).catch(err => reject(err));
        } else { resolve ({error: 'El juego ya existe', exist: true}); }
      }).catch(err => reject(err));
    });
  }
}
