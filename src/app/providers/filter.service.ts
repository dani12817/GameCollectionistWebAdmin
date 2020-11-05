import { Injectable } from '@angular/core';

import { SearchForm } from '../models/search';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filters: SearchForm = {type: 'game'};
  constructor() { }
}
