import { FormGroup } from "@angular/forms";

export class FormClass {
  formGroup: FormGroup;
  validationMessages: any = {};

  constructor(formGroup: any, validationMessages?: any) {
    if (validationMessages) {
      this.validationMessages = validationMessages;
    }
    this.formGroup = formGroup;
  }

  /**
   * Comprueba si el campo del formulario pasado como parámetro tiene algún error según sus Validators.
   * @param {string} field Campo del formulario a comprobar.
   * @return {string} String con el error que tiene el campo pasado como parámetro.
   */
  hasError(field: string): string | boolean {
    if (this.formGroup.get(field).errors !== undefined && this.formGroup.get(field).errors !== null) {
      const errors = Object.keys(this.formGroup.get(field).errors);
      if (errors.length > 0) {
        return this.validationMessages[field][errors[0]];
      }
    }
    return '';
  }

  /**
   * Comprueba si los valores del formulario 'formGroup' son correctos según sus Validators.
   * @return {boolean} Boolean con el resultado.
   */
  formIsInvalid(): boolean {
    if (this.formGroup.status === "VALID") {
      return false;
    }
    return true;
  }

  /**
   * Devuelve el 'value' del FormGroup.
   */
  getValue() {
    return this.formGroup.value;
  }
  
  getValueNotNull() {
    let formValue = {};
    for (const field of Object.keys(this.formGroup.value)) {
      if (this.get(field).value && this.get(field).value.length) { formValue[field] = this.get(field).value }
    }
    return formValue;
  }

  /**
   * Devuelve el campo del FromGroup pasado como parámetro.
   * @param {string} field Campo a buscar.
   * @return {AbstractControl} Objeto correspondiente al campo del FromGroup.
   */
  get(field: string) {
    return this.formGroup.get(field);
  }

  reset(): void {
    this.formGroup.reset();
  }

  patchValue(value: any) {
    this.formGroup.patchValue(value);
  }

  updateValueAndValidity(opts?: {onlySelf?: boolean, emitEvent?: boolean}) {
    this.formGroup.updateValueAndValidity(opts);
  }
}
