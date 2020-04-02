import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {StoreService} from "./store.service";
import {NotificationService} from "./notification.service";
import {EventType} from "../../../../common/websockets";
import {StoreName, InstrumentSeparator} from "../../../../common/forex";
import {Account} from "../domain";
import {filter, finalize, flatMap, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {getExchangeRateInstruments, getFormattedPosition, getPoint} from "../core/forex/utils";
import {InstrumentsService} from "./instruments.service";
import {WebsocketService} from "./websocket.service";

@Injectable()
export class PricesService implements OnDestroy {

  private observable: Observable<any>;
  private notificationSequenceSubscription: Subscription;
  private removed = [];
  private excluded = [];

  constructor(
    private http: HttpClient,
    private storeService: StoreService,
    private instrumentsService: InstrumentsService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    @Inject('API_WEBSOCKET_URL') private websocketUrl: string) {

    this.observable = websocketService.observe({
      retryDelay: 2000,
      retries: 5,
      fatalErrorHandler: () => window.location.reload(),
      url: websocketUrl,
      errorHandler: this.createNotificationSequenceSubscription
    });

    this.subscribeToStoreUpdates();

  }

  subscribeToStoreUpdates() {

    const instrumentsStoreUpdate = ({type, payload}) => {
      return type === StoreService.EventType.STORE_UPDATE &&
        payload.key === StoreName.INSTRUMENTS;
    };

    this.storeService.observable
      .pipe(filter(instrumentsStoreUpdate))
      .subscribe(({payload}) => {
        this.websocketService.send({
          type: EventType.ADD_INSTRUMENTS,
          payload: payload.value,
        });
      });
  }

  getPrices(account: Account) {

    return this.observable.pipe(
      flatMap<any, any>(this.getExchangeRateInstruments(account)),
      map(this.getAskBidPrice(account)),
      finalize(() => {
        if (!this.excluded.length) {
          this.excluded = [];
          this.removed = [];
        }
      })
    );
  }

  getExchangeRateInstruments = (account: Account) => ({prices, ...rest}) => {

    const exchangeRateInstruments = getExchangeRateInstruments(account, prices);

    if (!exchangeRateInstruments.length) {
      return of({
        prices,
        ...rest,
        rates: []
      });
    }

    const body = {
      instruments: exchangeRateInstruments
    };

    const observable = this.http.post<any[]>('/instruments', body);

    return observable.pipe(map(rates => {
      return {
        rates,
        prices,
        ...rest
      };
    }));
  };

  removeInstrument(instrument: string) {
    this.removed.push(instrument);
  }

  removeInstruments() {

    if (!this.removed.length) {
      return;
    }

    const instruments = [...this.removed];
    this.instrumentsService.removeInstruments(instruments);

    this.websocketService.send({
      type: EventType.REMOVE_INSTRUMENTS,
      payload: instruments
    });
  }

  getAskBidPrice = (account: Account) => ({prices, time, rates}) => {

    if (!account) {
      return {
        prices: [],
        updatedAt: new Date(),
      };
    }

    const formatted = [];

    for (const price of prices) {

      const {closeoutBid, closeoutAsk, instrument} = price;

      if (!this.removed.includes(instrument)) {

        const bid = parseFloat(closeoutBid);
        const ask = parseFloat(closeoutAsk);
        const point = getPoint(bid, ask);

        formatted.push({
          bid: bid,
          ask: ask,
          name: instrument,
          instrument: instrument.replace(InstrumentSeparator, '/'),
          point: point,
          position: getFormattedPosition(account, instrument, point, ask, rates),
        });

      } else {

        this.excluded.push(instrument);
      }
    }

    return {
      prices: formatted,
      updatedAt: new Date(time)
    };
  };

  ngOnDestroy(): void {
    this.websocketService.closeSocket();
  }

  createNotificationSequenceSubscription = (next) => {

    if (!this.notificationSequenceSubscription) {

      const observable = this.notificationService
        .sequence("A socket error occurred. Trying to reconnect", ['3', '2', '1'], 1000);

      this.notificationSequenceSubscription = observable.pipe(finalize(() => {
        this.notificationSequenceSubscription = null;
        next();
      })).subscribe();
    }
  }
}
