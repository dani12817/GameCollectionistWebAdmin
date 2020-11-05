import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from "@angular/common/locales/es";
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatToolbarModule,
MatIconModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDividerModule,
MatRadioModule, MatTabsModule, MatCheckboxModule, MatProgressBarModule } from '@angular/material';


import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { GameLibraryComponent } from '../home/game-library/game-library.component';
import { MainComponent } from '../home/main/main.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AddGameComponent } from '../home/add-game/add-game.component';
import { PendingGamesComponent } from '../home/pending-games/pending-games.component';
import { GameDetailsComponent } from '../home/game-details/game-details.component';
import { UserDataComponent } from '../home/user-data/user-data.component';
import { UserProfileComponent } from '../home/user-profile/user-profile.component';
import { SearchDialogComponent } from './dialogs/search-dialog/search-dialog.component';
import { UserCardComponent } from './user-card/user-card.component';

import { FocusMeDirective } from './focus.directive';


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
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatProgressBarModule
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
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DIALOG_DATA, useValue: []},
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    GameLibraryComponent, AddGameComponent, PendingGamesComponent,
    GameDetailsComponent,
    UserDataComponent, UserProfileComponent,
    SidenavComponent,
    MainComponent,
    SearchDialogComponent,
    UserCardComponent,
    FocusMeDirective
  ],
  entryComponents: [SearchDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
  constructor() {}
}
