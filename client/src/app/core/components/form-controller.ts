import {AbstractControl, FormGroup} from "@angular/forms";

export abstract class FormController {

  form: FormGroup;

  abstract onSubmit($event: Event): void;

  public isFieldInvalid(name: string): boolean {
    return this.form.get(name).invalid && (this.form.get(name).dirty || this.form.get(name).touched);
  }

  public hasFieldError(name: string, errorName: string): boolean {
    return !!this.form.get(name).errors[errorName];
  }

  public isAnyTouchedOrDirty() {
    return Object.keys(this.form.value).map(key => {
      return this.isDirtyOrTouched(this.form.get(key))
    }).filter(Boolean);
  }

  isDirtyOrTouched(formControl: AbstractControl) {
    return formControl.dirty || formControl.touched;
  }
}
