import {Component, HostListener, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StoreName} from "../../../../../common/forex";
import {StoreService} from "../../services/store.service";
import {map} from "rxjs/operators";
import * as Fuze from "fuse.js";
import {InstrumentsService} from "../../services/instruments.service";

@Component({
  selector: 'app-instruments-form',
  templateUrl: './instruments-form.component.html',
  styleUrls: ['./instruments-form.component.scss']
})
export class InstrumentsFormComponent {

  @ViewChild('symbolOptionsElement') symbolOptionsElement;

  form = new FormGroup({
    currency: new FormControl('', [
      Validators.required,
    ]),
  });

  options = [];
  selected = new Set<string>();

  constructor(private storeService: StoreService, private instrumentsService: InstrumentsService) {
  }

  addCurrencyPair(name: string) {
    if (this.selected.has(name)) {
      this.selected.delete(name);
    } else {
      this.selected.add(name);
    }
  }

  onSubmit() {
    const currentSelected = this.storeService.get(StoreName.INSTRUMENTS) || [];
    const combined = [
      ...this.selected,
      ...currentSelected
    ].filter(Boolean);

    const selectedInstruments = new Set<string>(combined);

    this.storeService.set(StoreName.INSTRUMENTS, [...selectedInstruments]);

    this.reset();
  }

  filterInstruments() {
    const currency = this.form.get("currency").value;
    const options = {
      keys: ['displayName', 'name']
    };
    this.instrumentsService.observable.pipe(
      map(instruments => {
        if (currency) {
          return new Fuze(instruments, options).search(currency).map(({item}) => item);
        }
        return instruments;
      }),
    ).subscribe(instruments => {
      this.options = instruments;
    })

  }

  reset() {
    this.options = [];
    this.selected.clear();
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
    if (this.symbolOptionsElement) {
      const clickedInside = this.symbolOptionsElement.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.reset();
      }
    }
  }

}
