import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StoreService} from "../../services/store.service";
import {StoreName} from "../../../../../common/forex";
import {Account, AccountSize} from '../../domain'
import {FormController} from "../../core/components/form-controller";

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent extends FormController implements OnInit {

  @Output() submit = new EventEmitter<Account>();
  @Output() onInit = new EventEmitter<Account>();

  accountSize = [
    {label: "Standard Lot", value: AccountSize.Standard},
    {label: "Mini Lot", value: AccountSize.Mini},
    {label: "Micro Lot", value: AccountSize.Micro},
  ];

  form = new FormGroup({
    balance: new FormControl(1000, [
      Validators.required,
      Validators.min(0),
    ]),
    risk: new FormControl(3, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    stoploss: new FormControl(100, [
      Validators.required,
      Validators.min(0),
    ]),
    baseCurrency: new FormControl('GBP', [
      Validators.required
    ]),
    accountSize: new FormControl(AccountSize.Standard, [
      Validators.required
    ]),
  });

  constructor(private storeService: StoreService) {
    super();
  }

  ngOnInit(): void {

    const accountValues = this.storeService.get(StoreName.ACCOUNT);

    if (accountValues) {
      const value = this.form.value;
      this.form.setValue({...value, ...accountValues});
    } else {
      this.storeService.set(StoreName.ACCOUNT, this.form.value);
    }

    this.onInit.emit(this.form.value);
  }

  public onSubmit($event: Event) {
    $event.stopPropagation();
    this.storeService.set(StoreName.ACCOUNT, this.form.value);
    this.submit.emit(this.form.value)
  }

  setBaseCurrency(currency: string) {
    this.form.get('baseCurrency').setValue(currency);
  }

  setAccountSize(accountSize: AccountSize) {
    this.form.get('accountSize').setValue(accountSize);
  }

  getAccountSizeLabel() {
    const value = this.form.get('accountSize').value;
    for (const option of this.accountSize) {
      if (value === option.value) {
        return option.label;
      }
    }
  }
}
