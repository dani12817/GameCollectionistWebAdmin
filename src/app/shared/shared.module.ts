import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from "@angular/common/locales/es";
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatToolbarModule,
MatIconModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDividerModule,
MatDialogModule } from '@angular/material';

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { GameLibraryComponent } from '../home/game-library/game-library.component';
import { MainComponent } from '../home/main/main.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AddGameComponent } from '../home/add-game/add-game.component';
import { PendingGamesComponent } from '../home/pending-games/pending-games.component';
import { GameDetailsComponent } from '../home/game-details/game-details.component';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    GameLibraryComponent, AddGameComponent, PendingGamesComponent,
    GameDetailsComponent,
    SidenavComponent,
    MainComponent,
  ],
  entryComponents: [ ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
  constructor() {}
}
