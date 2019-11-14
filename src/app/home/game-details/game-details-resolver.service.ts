import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';

@Injectable({
  providedIn: 'root'
})
export class GameDetailsResolverService implements Resolve<Game> {
  constructor(private gameServ: GameService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<Game> {
    return this.gameServ.getGameByGameCode(route.paramMap.get('game_code'), route.routeConfig.path.includes('pending'));
  }
}
