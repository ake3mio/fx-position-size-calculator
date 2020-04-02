import {Component, OnDestroy} from '@angular/core';
import {PricesService} from "../../services/prices.service";
import {Account} from '../../domain'
import {Subscription} from "rxjs";
import {WebsocketService} from "../../services/websocket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    [PricesService, {provide: WebsocketService}]
  ]
})
export class HomeComponent implements OnDestroy {
  lastPricesUpdateMs = null;
  account: Account;
  updatedAt = null;
  prices = [];
  removed = [];
  priceSubscription: Subscription;
  interval: number;

  constructor(private pricesService: PricesService) {
     this.interval = setInterval(()=>{
      if(this.lastPricesUpdateMs && Date.now() - this.lastPricesUpdateMs > 3000) {
        this.prices = [];
        this.lastPricesUpdateMs = null;
      }
    });
  }

  onAccountFormSubmit(account: Account) {
    this.priceSubscription.unsubscribe();
    this.initAccount(account);
  }

  removeInstrument(instrument: string) {
    this.removed.push(instrument);
    this.pricesService.removeInstrument(instrument);
    this.setPrices(this.prices);
  }

  setPrices(prices) {
    let excluded = 0;
    this.prices = [];

    for (const price of prices) {
      if (this.removed.includes(price.name)) {
        excluded++;
      } else {
        this.prices.push(price);
      }
    }

    if (excluded === 0) {
      this.removed = [];
    }
  }

  updateAccount(account: Account) {
    this.account = account;
  }

  initAccount(account: Account) {

    this.updateAccount(account);

    const observable = this.pricesService.getPrices(this.account);

    this.priceSubscription = observable
      .subscribe(({prices, updatedAt}) => {
        this.setPrices(prices);
        this.updatedAt = updatedAt;
        this.lastPricesUpdateMs = Date.now();
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
