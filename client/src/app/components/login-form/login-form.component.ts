import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormController} from "../../core/components/form-controller";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends FormController {

  @Output() submit = new EventEmitter();
  @Input() formError = null;

  form = new FormGroup({
    accountId: new FormControl('', [
      Validators.required,
    ]),
    token: new FormControl('', [
      Validators.required,
    ])
  });

  constructor() {
    super();
  }

  onSubmit($event: Event) {
    $event.stopPropagation();
    this.submit.emit(this.form.value);
  }
}
