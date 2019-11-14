import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersGameLibrary = this.afs.collection<User[]>("usersGameLibrary");

  constructor(private authService: AuthService, private afs: AngularFirestore) { }

  addGameToLibrary(gamecode: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this.authService.userLogged.games.push({gamecode: gamecode, reference: this.afs.doc(`games/${gamecode}`).ref});
        this.usersGameLibrary.doc<User>(this.authService.userLogged.uid).update(this.authService.userLogged).then(() => {
            resolve(true);
        }, err => reject(err));
    });
  }

  removeGameFromLibrary(gamecode: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this.authService.userLogged.games.splice(this.authService.userLogged.games.findIndex(game => game.gamecode === gamecode), 1);
        this.usersGameLibrary.doc<User>(this.authService.userLogged.uid).update(this.authService.userLogged).then(() => {
            resolve(true);
        }, err => reject(err));
    });
  }

  gameOnLibrary(gamecode: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this.authService.getLoggedInUser().then((response: User) => {
            for (const game of response.games) {
                if (game.gamecode === gamecode) {
                    resolve(true);
                }
            }
            resolve(false);
        }, err => reject(err));
    });
  }
}
