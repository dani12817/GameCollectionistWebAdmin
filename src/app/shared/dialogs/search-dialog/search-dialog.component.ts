import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { FilterService } from '../../../providers/filter.service';

import { FormClass } from '../../form-class';
import { platforms, gameRegions, genres } from '../../constant';
import { GameMethods } from '../../game-methods';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {
  searchForm: FormClass; gameMeth = GameMethods;
  platforms: string[] = platforms;
  regions: string[] = gameRegions;
  genres: string[] = genres;

  constructor(private dialogRef: MatDialogRef<SearchDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private filterService: FilterService) {
    this.initForm();
    //console.log("filters", this.filterService.filters);
  }

  initForm() {
    this.searchForm = new FormClass(new FormGroup({
      'type': new FormControl({value: 'game', disabled: false}),
      'name': new FormControl({value: null, disabled: false}),
      'nickname': new FormControl({value: null, disabled: false}),
      'game_code': new FormControl({value: null, disabled: false}),
      'platform': new FormControl({value: null, disabled: false}),
      'genres': new FormControl({value: null, disabled: false}),
      'region': new FormControl({value: null, disabled: false}),
      'release_date': new FormControl({value: null, disabled: false}),
    }));
    if (this.filterService.filters) { this.searchForm.patchValue(this.filterService.filters); }
  }

  resetForm() {
    let type = this.searchForm.get('type').value
    this.searchForm.reset();
    this.searchForm.patchValue({type: type})
  }

  submitSearch() {
    this.filterService.filters = this.searchForm.getValueNotNull();
    //console.log("submitSearch", this.filterService.filters);
    this.dialogRef.close();
  }
}
