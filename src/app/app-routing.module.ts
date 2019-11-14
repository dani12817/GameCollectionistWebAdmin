import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './home/main/main.component';
import { GameLibraryComponent } from './home/game-library/game-library.component';
import { AddGameComponent } from './home/add-game/add-game.component';
import { PendingGamesComponent } from './home/pending-games/pending-games.component';
import { GameDetailsComponent } from './home/game-details/game-details.component';

import { AuthGuard } from './shared/auth-guard.service';
import { AdminGuard } from './shared/admin-guard.service';

import { AuthUserResolverService } from './shared/resolvers/auth-user-resolver.service';
import { GameDetailsResolverService } from './home/game-details/game-details-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      authUser: AuthUserResolverService
    },
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'my-games',
        component: GameLibraryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'add-game',
        component: AddGameComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'edit-game/:game_code',
        component: AddGameComponent,
        canActivate: [AdminGuard],
        resolve: {
          gameData: GameDetailsResolverService
        }
      },
      {
        path: 'pending/:game_code',
        component: AddGameComponent,
        canActivate: [AdminGuard],
        resolve: {
          pendingGameData: GameDetailsResolverService
        }
      },
      {
        path: 'pending-games',
        component: PendingGamesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':game_code',
        component: GameDetailsComponent,
        resolve: {
          gameData: GameDetailsResolverService
        }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
