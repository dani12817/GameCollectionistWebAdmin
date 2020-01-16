import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './home/main/main.component';
import { GameLibraryComponent } from './home/game-library/game-library.component';
import { AddGameComponent } from './home/add-game/add-game.component';
import { PendingGamesComponent } from './home/pending-games/pending-games.component';
import { GameDetailsComponent } from './home/game-details/game-details.component';
import { UserDataComponent } from './home/user-data/user-data.component';
import { UserProfileComponent } from './home/user-profile/user-profile.component';

import { AuthGuard } from './shared/auth-guard.service';
import { AdminGuard } from './shared/admin-guard.service';

import { AuthUserResolverService } from './shared/resolvers/auth-user-resolver.service';
import { GameDetailsResolverService } from './home/game-details/game-details-resolver.service';
import { UserDataResolverService } from './shared/resolvers/user-data-resolver.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
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
        path: 'user-data',
        component: UserDataComponent,
        canActivate: [AuthGuard],
        resolve: {
          userData: UserDataResolverService
        }
      },
      {
        path: 'user/:nickname',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
        resolve: {
          userData: UserDataResolverService
        }
      },
      {
        path: 'my-games',
        component: GameLibraryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'request-game',
        component: AddGameComponent,
        canActivate: [AdminGuard],
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
          gameData: GameDetailsResolverService
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
