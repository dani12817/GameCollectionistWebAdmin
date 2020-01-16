import { Component } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';
import { LoadingService } from '../../providers/loading.service';

import { gameRegions, platforms, genres } from '../../shared/constant';
import { noWhitespaceValidator } from '../../shared/validators/form-validators';
import { GameMethods } from '../../shared/game-methods';
import { FormClass } from '../../shared/form-class';
import { element } from 'protractor';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent {
  gameForm: FormClass; gameData: Game; gameAction: string = 'requestGame';
  gameBoxart: {file: File, url: string | ArrayBuffer} = {file: null, url: null};
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

  constructor(private route: ActivatedRoute, private gameService: GameService, private router: Router, private snackbar: MatSnackBar, private dialog: MatDialog,
  public loading: LoadingService) {
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      this.createForm();

      if (this.router.url.includes('add') || this.router.url.includes('edit') || this.router.url.includes('pending')) {
        if (this.router.url.includes('edit')) { this.gameAction = 'editGame'; }
        if (this.router.url.includes('add')) { this.gameAction = 'createGame'; }
        if (this.router.url.includes('pending')) { this.gameAction = 'pendingGame'; }
        this.gameForm.formGroup.get('name').setValidators([]);
        this.gameForm.formGroup.get('genres').setValidators([]);
        this.gameForm.formGroup.get('region').setValidators([]);
        this.gameForm.formGroup.get('platform').setValidators([]);
        this.gameForm.formGroup.updateValueAndValidity();
      }

      if ((this.router.url.includes('edit') || this.router.url.includes('pending')) && !routeData.gameData) { this.router.navigate(['/']); }

      if (routeData.gameData) { this.gameData = routeData.gameData; } else { this.gameData = new Game(); }
      
      this.gameForm.patchValue(this.gameData);
      this.gameBoxart.url = this.gameData.image;
    });
  }

  createForm() {
    this.gameForm = new FormClass(new FormGroup({
      'collectors_edition': new FormControl({value: false, disabled: false}),
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
    }), this.validationMessages);
  }

  selectBoxart(event: any) {
    if(event.target.files && event.target.files.length) {
      this.gameBoxart.file = event.target.files[0];
      this.reader.readAsDataURL(this.gameBoxart.file); 
      this.reader.onload = (_event) => { 
        this.gameBoxart.url = this.reader.result; 
      }
      console.log("gameBoxart", this.gameBoxart.file);
    }
  }

  removeNewBoxart() {
    this.gameBoxart.file = null;
    this.gameBoxart.url = this.gameData.image; 
  }

  async submitGame() {
    this.loading.isLoading = true;
    try {
      if (this.gameData.game_code) {
        if (this.gameAction === 'pendingGame') {
          await this.deleteUpdateGame(true, true);
          this.loading.isLoading = false;
          console.log("deleteUpdateGame finished");
        } else if (this.gameData.game_code !== this.gameForm.get('game_code').value) {
          let gameExists = await this.gameService.gameExist(this.gameForm.get('game_code').value);
          if (gameExists.exist) {
            this.snackbar.open(gameExists.error);
          } else {
            await this.deleteUpdateGame(false, true);
          }
          this.loading.isLoading = false;
        } else {
          this.updateGame();
        }
      } else {
        let gameExists = await this.gameService.gameExist(this.gameForm.get('game_code').value);
        if(gameExists.exist) {
          this.snackbar.open(gameExists.error);
        } else {
          console.log("this.gameAction", this.gameAction);
          await this.gameService.createGame(this.gameForm.getValue(), this.gameBoxart.file, (this.gameAction === 'requestGame'));
          this.snackbar.open('Petición de Juego enviada');
          this.router.navigate(['/']);
        }
        this.loading.isLoading = false;
      }
    } catch (err) { console.error(err); this.loading.isLoading = false; }
  }

  private updateGame() {
    let newGameData = Object.assign(this.gameData, this.gameForm.getValue());
    this.gameService.updateGame(newGameData, this.gameBoxart.file).then(response => {
      this.snackbar.open("Juego Actualizado");
      console.log('updateGame', response);
      this.router.navigate(['/edit-game/', response.game_code]);
      this.loading.isLoading = false;
    }).catch(err => console.error(err));
  }

  async deleteUpdateGame(pending: boolean, update?: boolean): Promise<void> {
    console.log('before deleteGame');
    await this.gameService.deleteGame(this.gameData.game_code, pending);
    console.log('after deleteGame');
    if (update) { this.updateGame(); } else {
      this.router.navigate(pending ? ['/pending-games'] : ['/']);
    }
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

  removeFromOtherList(element, acction: string) {
    let otherList: {game_code: string, region?: string, platform?: string}[] = this.gameForm.get(acction).value;
    otherList.splice(otherList.indexOf(element), 1);
  }
}
