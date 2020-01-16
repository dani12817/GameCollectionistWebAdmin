
import { Injectable } from '@angular/core';

import { Game } from '../models/game';
import { User } from '../models/user';

@Injectable()
export class GameMethods {
    public static getRegionImage(region: string): string {
        return `assets/img/region/${region}.png`;
    }

    public static getPlatformImage(platform: string): string {
        return `assets/img/platforms/${platform.toLowerCase().replace(/\s/g, "")}.png`;
    }

    public static getGameImage(game: Game): string {
        return game.image ? game.image : 'assets/img/no_image.jpg';
    }

    public static getAvatar(user: User): string {
        return user.avatar ? user.avatar : 'assets/img/no_image.jpg';
    }
}