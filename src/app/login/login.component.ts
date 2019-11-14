import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(public authService: AuthService, private router: Router, public afAuth: AngularFireAuth, private fb: FormBuilder) {
    if (this.afAuth.auth.currentUser) { this.router.navigate(['/']); }
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [{value: '', disabled: false}, Validators.required ],
      password: [{value: '', disabled: false}, Validators.required]
    });
  }

  dologinEmailPass() {
    this.authService.loginEmailPass(this.loginForm.value).then(response => {
      console.log("loginEmailPass", response);
      this.router.navigate(['/']);
    }).catch(err => console.error(err));
  }

  dologinSocialNetwork(loginType: string) {
    let provider;
    switch (loginType) {
      case 'twitter':
        provider = new auth.TwitterAuthProvider();
        break;

      case 'google':
        provider = new auth.GoogleAuthProvider();
        break;

      case 'facebook':
        provider = new auth.FacebookAuthProvider();
        break;
    }

    this.authService.loginSocialNetwork(provider).then(response => {
      console.log("loginSocialNetwork", response);
      this.router.navigate(['/']);
    }).catch(err => console.error(err));
  }
}
