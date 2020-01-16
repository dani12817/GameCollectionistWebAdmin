import { Component } from '@angular/core';

import { LoadingService } from './providers/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GameCollectionistWeb';

  constructor(public loading: LoadingService) {
  }
}
