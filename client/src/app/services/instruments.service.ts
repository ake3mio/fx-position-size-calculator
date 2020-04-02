import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {StoreName} from "../../../../common/forex";
import {StoreService} from "./store.service";

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {

  private instruments = [];

  constructor(private http: HttpClient, private storeService: StoreService) {

    this.observable.subscribe(_ => {
      console.info("Instruments updated!");
    });
  }

  get observable(): Observable<any[]> {
    if (this.instruments.length) {
      return of(this.instruments)
    }
    return new Observable(subscriber => {
      this.http.get<any[]>('/instruments').subscribe(instruments => {
        this.instruments = instruments;
        subscriber.next(instruments);
        subscriber.complete();
      });
    });
  }

  public removeInstruments(instruments: string[]) {

    if (!instruments.length) {
      return;
    }
    const oldSelectedInstruments = new Set<string>(this.storeService.get(StoreName.INSTRUMENTS) || []);

    instruments.forEach(instrument => oldSelectedInstruments.delete(instrument));
    this.storeService.set(StoreName.INSTRUMENTS, [...oldSelectedInstruments]);
  }
}
