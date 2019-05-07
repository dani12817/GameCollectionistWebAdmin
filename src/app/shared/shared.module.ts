import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from "@angular/common/locales/es";

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ ],
  declarations: [HomeComponent, LoginComponent],
  entryComponents: [ ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
  constructor() {}
}
