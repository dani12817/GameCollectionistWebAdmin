import { Component } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';
import { gameRegions, platforms, genres } from '../../shared/constant';
import { noWhitespaceValidator } from '../../shared/validators/form-validators';
import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent {
  gameForm: FormGroup; gameData: Game; pendingGame: boolean = false;
  gameBoxart: File; gameBoxartURL;
  gameRegions: string[] = gameRegions; platforms: string[] = platforms; genres: string[] = genres;
  gameMeth = GameMethods;
  
  addOtherAction: string; addOtherGameList: Game[];

  reader = new FileReader()

  validationMessages = {
    name: {required: 'El nombre es obligatorio.'},
    game_code: {required: 'El código del juego es obligatorio.', whitespace: 'No tiene que haber espacios en blanco'},
    genres: {required: 'Se tiene que seleccionar al menos un género.'},
    region: {required: 'La región es obligatoria.'},
    platform: {required: 'La plataforma es obligatoria.'},
    barcode: {required: 'El código de barras es obligatorio.'},
  };

  constructor(private route: ActivatedRoute, private gameService: GameService, private router: Router, private snackbar: MatSnackBar, private dialog: MatDialog) {
    this.route.data.subscribe((routeData: {gameData?: Game, pendingGameData?: Game}) => {
      this.createForm();
      if (routeData.gameData || routeData.pendingGameData) {
        console.log("edit game");
        this.pendingGame = routeData.pendingGameData !== undefined;
        this.gameData = routeData.gameData ? routeData.gameData : routeData.pendingGameData;
        if (this.gameData === null || this.gameData === undefined) {
          this.router.navigate(['/']); } else { this.gameForm.patchValue(this.gameData); this.gameBoxartURL = this.gameData.image; }
      } else { this.gameData = new Game(); }
    });
  }

  createForm() {
    this.gameForm = new FormGroup({
      'name': new FormControl({value: '', disabled: false}, [Validators.required]),
      'original_name': new FormControl({value: '', disabled: false}),
      'game_code': new FormControl({value: '', disabled: false}, [Validators.required, noWhitespaceValidator]),
      'genres': new FormControl({value: '', disabled: false}, [Validators.required]),
      'release_date': new FormControl({value: '', disabled: false}),
      'region': new FormControl({value: '', disabled: false}, [Validators.required]),
      'platform': new FormControl({value: '', disabled: false}, [Validators.required]),
      'namecode': new FormControl({value: '', disabled: false}),
      'barcode': new FormControl({value: '', disabled: false}, [Validators.required]),
      'other_platforms': new FormControl({value: [], disabled: false}),
      'other_regions': new FormControl({value: [], disabled: false}),
      'collectors_edition': new FormControl({value: false, disabled: false}),
    });
  }

  hasError(formGroup: FormGroup, field: string): string|boolean {
    if (formGroup.get(field).errors !== undefined && formGroup.get(field).errors !== null) {
      const errors = Object.keys(formGroup.get(field).errors);
      if (errors.length > 0) {
        return this.validationMessages[field][errors[0]];
      }
    }
    return false;
  }

  formIsInvalid(): boolean {
    if (this.gameForm.status === 'VALID' && (this.gameBoxart || this.gameData.image)) {
      return false;
    }
    return true;
  }

  selectBoxart(event: any) {
    if(event.target.files && event.target.files.length) {
      this.gameBoxart = event.target.files[0];
      this.reader.readAsDataURL(this.gameBoxart); 
      this.reader.onload = (_event) => { 
        this.gameBoxartURL = this.reader.result; 
      }
      console.log("gameBoxart", this.gameBoxart);
    }
  }

  removeNewBoxart() {
    this.gameBoxart = null;
    this.gameBoxartURL = this.gameData.image; 
  }

  submitGame() {
    if (this.gameData.game_code) {
      if (this.pendingGame) {
        this.gameService.deleteGame(this.gameData.game_code, true).then(() => {
          this.updateGame();
        }).catch(err => console.error(err));
      } else if (this.gameData.game_code !== this.gameForm.get('game_code').value) {
        this.gameService.gameExist(this.gameForm.get('game_code').value).then(gameExist => {
          if(gameExist) {
            this.snackbar.open("El nuevo código de juego ya existe");
          } else {
            this.gameService.deleteGame(this.gameData.game_code).then(() => {
              this.updateGame();
            }).catch(err => console.error(err));
          }
        }).catch(err => console.error(err));
      } else {
        this.updateGame();
      }
    } else {
      this.gameService.gameExist(this.gameForm.get('game_code').value).then(gameExist => {
        if(gameExist) {
          this.snackbar.open("El Juego ya existe");
        } else {
          this.gameService.createGame(this.gameForm.value, this.gameBoxart).then(response => {
            this.snackbar.open("Juego Creado");
            this.router.navigate(['/edit-game', response.game_code]);
          }).catch(err => console.error(err));
        }
      }).catch(err => console.error(err));
    }
  }

  private updateGame() {
    let newGameData = Object.assign(this.gameData, this.gameForm.value);
    this.gameService.updateGame(newGameData, this.gameBoxart).then(response => {
      this.snackbar.open("Juego Actualizado");
      this.router.navigate(['/edit-game', response.game_code]);
    }).catch(err => console.error(err));
  }

  openDialog(dialogRef, type: string) {
    this.addOtherGameList = null; this.addOtherAction = type;
    this.dialog.open(dialogRef, {width: '400px', panelClass: 'addOtherDialog'});
  }

  filterGameList(textFilter: string) {
    this.addOtherGameList = [];
    this.gameService.getAllGames().then(response => {
      if (textFilter.trim().length > 1) {
        for (const game of response) {
          if (game.name.toLowerCase().includes(textFilter) && game.name !== this.gameData.name) {
            this.addOtherGameList.push(game);
          }
        }
      } else { this.addOtherGameList = response; }
    }).catch(err => console.error(err));
  }

  addToOtherList(game: Game) {
    let otherList: {game_code: string, region?: string, platform?: string}[] = this.gameForm.get(this.addOtherAction).value;
    if(this.addOtherAction === 'other_regions') {
      otherList.push({game_code: game.game_code, region: game.region});
    } else { otherList.push({game_code: game.game_code, platform: game.platform}); }
  }
}
