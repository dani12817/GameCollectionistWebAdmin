import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { UserService } from '../../providers/user.service';
import { LoadingService } from '../../providers/loading.service';
import { User } from '../../models/user';

import { FormClass } from '../../shared/form-class';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent {
  userData: User; userDataForm: FormClass;
  userAvatar: {file: File, url: string | ArrayBuffer} = {file: null, url: null};
  reader = new FileReader();

  validationMessages = {
    name: {required: 'El nombre es obligatorio.'},
    nickname: {required: 'Se tiene que seleccionar al menos un género.'},
    email: {required: 'La región es obligatoria.'},
    avatar: {required: 'La plataforma es obligatoria.'},
  };

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, public loading: LoadingService) {
    this.route.data.subscribe((routeData: {userData: User}) => {
      this.userData = routeData.userData;
      if (this.userData === null || this.userData === undefined) { this.router.navigate(['/']); }
      this.initForm();
      console.log("userData", this.userData.name);
    });
  }

  initForm() {
    this.userDataForm = new FormClass (new FormGroup({
      'name': new FormControl({value: null, disabled: false}, [Validators.required]),
      'nickname': new FormControl({value: null, disabled: false}, [Validators.required]),
      'email': new FormControl({value: null, disabled: false}, [Validators.required])
    }), this.validationMessages);
    this.userDataForm.patchValue(this.userData);
    this.userAvatar.url = this.userData.avatar;
    console.log("this.userDataForm", this.userDataForm);
  }

  selectAvatar(event: any) {
    if (event.target.files && event.target.files.length) {
      this.userAvatar.file = event.target.files[0];
      this.reader.readAsDataURL(this.userAvatar.file); 
      this.reader.onload = (_event) => { 
        this.userAvatar.url = this.reader.result; 
      };
    }
  }

  removeNewAvatar() {
    this.userAvatar.file = null;
    this.userAvatar.url = this.userData.avatar; 
  }

  submitData() {
    this.loading.isLoading = true;
    let userData: User = this.userDataForm.getValue();
    this.userData.name = userData.name;
    this.userService.updateUser(this.userData, this.userAvatar);
  }
}
