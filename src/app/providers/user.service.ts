import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { User, UserGame } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersGameLibrary = this.afs.collection<User>("usersGameLibrary");

  constructor(private authService: AuthService, private storage: AngularFireStorage, private afs: AngularFirestore) { }

  getUser(nickname: string, loggedUser?: boolean): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      console.log("getUser", loggedUser);
      if (loggedUser) {
        resolve(this.authService.userLogged);
      } else {
        let sub = this.afs.collection<User>('usersGameLibrary', ref => ref.where("nickname", "==", nickname)).valueChanges().subscribe(response => {
          sub.unsubscribe();
          if (response.length > 0) {
            resolve(response[0]);
          } else { resolve(null); }
        }, err => reject(err));
      }
    });
  }

  searchUser(nickname: string): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      let sub = this.usersGameLibrary.valueChanges().subscribe(response => {
        sub.unsubscribe();
        let searchResult: User[] = [];
        if (!nickname) {
          searchResult = response;
        } else {
          for (const user of response) {
            if (user.nickname.toLowerCase().includes(nickname.toLowerCase())) { searchResult.push(user); }
          }
        }
        resolve(searchResult);
      }, err => reject(err));
    });
  }

  addUserToFriends(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.userLogged.friends.push({uid: user.uid, reference: this.afs.doc(`usersGameLibrary/${user.uid}`).ref});
      user.friends.push({uid: this.authService.userLogged.uid, reference: this.afs.doc(`usersGameLibrary/${this.authService.userLogged.uid}`).ref});
      this.usersGameLibrary.doc(this.authService.userLogged.uid).set(this.authService.userLogged);
      this.usersGameLibrary.doc(user.uid).set(user);
      resolve();
    });
  }

  removeUserFromFriends(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.userLogged.friends.splice(this.authService.userLogged.friends.findIndex(friend => friend.uid === user.uid), 1);
      user.friends.splice(user.friends.findIndex(friend => friend.uid === this.authService.userLogged.uid), 1);
      this.usersGameLibrary.doc(this.authService.userLogged.uid).set(this.authService.userLogged);
      this.usersGameLibrary.doc(user.uid).set(user);
      resolve();
    });
  }

  updateUser(userData: User, avatarData: {file: File, url: string | ArrayBuffer}): Promise<User> {
    if (avatarData.file) {
      return this.saveWithBoxart(avatarData.file, userData);
    } else { return this.saveUserData(userData); }
  }

  private async saveWithBoxart(boxart, userData: User) {
    return new Promise<User>((resolve, reject) => {
      const fileRef = this.storage.ref(`users/${userData.uid}`);
      const metaData = { contentType: boxart.type };

      fileRef.put(boxart, metaData).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          userData.avatar = downloadURL;
          this.saveUserData(userData).then(response => {
            resolve(response);
          });
        }, err => reject(err));
      }, err => reject(err));
    });
  }
  
  private saveUserData(userData): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      console.log("Usuario Actualizado");
      this.usersGameLibrary.doc(userData.uid).set(userData);
      resolve(userData);
    });
  }

  addGameToLibrary(gamecode: string, type: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.gameOnLibrary(gamecode).then(onLibrary => {
        if (onLibrary) {
          let usergame = this.authService.userLogged.games.find(usergame => usergame.gamecode === gamecode);
          usergame.type = type;
        } else {
          if (!this.authService.userLogged.games) { this.authService.userLogged.games = []; }
          this.authService.userLogged.games.push({gamecode: gamecode, reference: this.afs.doc(`games/${gamecode}`).ref, type: type});
        }
        this.usersGameLibrary.doc<User>(this.authService.userLogged.uid).update(this.authService.userLogged).then(() => {
          resolve(true);
        }, err => reject(err));
      });
    });
  }

  editGameOnLibrary(userGame: UserGame): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {      
      let index = this.authService.userLogged.games.findIndex(usergame => usergame.gamecode === userGame.gamecode);
      this.authService.userLogged.games[index] = userGame;
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

  gameOnLibrary(gamecode: string): Promise<UserGame> {
    return new Promise<UserGame>((resolve, reject) => {
        this.authService.getLoggedInUser().then((response: User) => {
          if (response) {
            for (const game of response.games) {
                if (game.gamecode === gamecode) {
                    if (game.bought_date) { game.bought_date = new Date(game.bought_date.seconds); }
                    resolve(game);
                }
            }
          }
          resolve(null);
        }, err => reject(err));
    });
  }
}
