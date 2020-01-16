import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

import { Game } from '../../models/game';
import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';
import { LoadingService } from '../../providers/loading.service';

import { GameMethods } from '../../shared/game-methods';
import { currencies, userLibraries } from '../../shared/constant';
import { FormClass } from '../../shared/form-class';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent {
  gameData: Game; gameMeth = GameMethods;
  userGameForm: FormClass;
  userLibraries = userLibraries; currencies = currencies;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private snackbar: MatSnackBar, public authService: AuthService,
  private dialog: MatDialog, public loading: LoadingService) {
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      this.gameData = routeData.gameData;
      if (this.gameData === null || this.gameData === undefined) { this.router.navigate(['/']); }
      console.log("this.gameData", this.gameData.name);
      this.getGameOnLibrary();
    });
  }  

  private initFrom() {
    this.userGameForm = new FormClass(new FormGroup({
      'price': new FormControl({value: null, disabled: false}),
      'currency': new FormControl({value: null, disabled: false}),
      'bought_date': new FormControl({value: null, disabled: false})
    }));
    this.userGameForm.patchValue(this.gameData.userGame);
  }

  private getGameOnLibrary() {
    this.userService.gameOnLibrary(this.gameData.game_code).then(response => {
      this.gameData.userGame = response;
      if (!this.gameData.userGame) { this.gameData.userGame = {type: 'null'} }
      this.initFrom();
    }).catch(err => console.error(err));
  }

  addGameToLibrary(type: string) {
    this.loading.isLoading = true;
    if (this.gameData.userGame.type !== 'null') {
      this.userService.addGameToLibrary(this.gameData.game_code, type).then(async response => {
        this.snackbar.open(`Juego añadido a tu biblioteca '${userLibraries[type]}'.`);
        this.getGameOnLibrary();
        this.loading.isLoading = false;
      }).catch(err => console.error(err));
    } else { this.removeGameFromLibrary(); }
  }

  removeGameFromLibrary() {
    this.userService.removeGameFromLibrary(this.gameData.game_code).then(async response => {
      this.snackbar.open("Juego eliminado de tu biblioteca");
      this.loading.isLoading = false;
    }).catch(err => console.error(err));
  }

  objectKeys(element: any) {
    return Object.keys(element);
  }
  
  openDialog(dialogRef) {
    this.dialog.open(dialogRef, {width: '400px', panelClass: 'userGameDetailsDialog'});
  }

  async submitUserGame() {
    this.loading.isLoading = true;
    this.gameData.userGame.price = this.userGameForm.get('price').value;
    this.gameData.userGame.currency = this.userGameForm.get('currency').value;
    this.gameData.userGame.bought_date = this.userGameForm.get('bought_date').value;
    console.log("userGame", this.gameData.userGame);
    await this.userService.editGameOnLibrary(this.gameData.userGame);
    this.loading.isLoading = false;
    this.snackbar.open("Datos del Juego actualizados");
    this.dialog.closeAll();
  }
}
