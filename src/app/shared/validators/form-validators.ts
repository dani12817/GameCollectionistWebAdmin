import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

export function noWhitespaceValidator(control: FormControl) {
  if (control.value) {
    if (control.value.includes(' ')) {
      return {'whitespace': true};
    }
    return null;
  }
  return null;
}
