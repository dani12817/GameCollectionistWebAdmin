import { UserGame } from './user';

export class Game {
  game_code: string;
  genres: string[];
  image: any;
  name: string;
  namecode: string;
  original_name: string;
  other_versions: {name: string, game_code: string, image?: string}[];
  other_platforms: {platform: string, game_code: string}[];
  other_regions: {region: string, game_code: string}[];
  platform: string;
  region: string;
  release_date: Date;
  release_date_full: string;
  game_on_library?: boolean;
  userGame: UserGame;

  constructor(gameData?) {
    Object.assign(this, gameData)

    if (gameData && gameData.release_date) {
      this.release_date = new Date(gameData.release_date.seconds * 1000);
      this.release_date_full = `${this.release_date.getDate()} de ${this.release_date.toLocaleString('default', { month: 'long' })} del ${this.release_date.getFullYear()}`;
    }
  }
}
