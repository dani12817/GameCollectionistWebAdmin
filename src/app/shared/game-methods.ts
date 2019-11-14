
import { Injectable } from '@angular/core';

@Injectable()
export class GameMethods {
    public static getRegionImage(region: string): string {
        return `assets/img/region/${region}.png`;
    }

    public static getPlatformImage(platform: string): string {
        return `assets/img/platforms/${platform.toLowerCase().replace(/\s/g, "")}.png`;
    }
}