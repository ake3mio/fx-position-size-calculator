import {Injectable} from '@angular/core';
import Cookies from 'js-cookie';
import {Observable, Subject} from "rxjs";

const converter = {
  write: value => encodeURIComponent(String(value))
    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent),
  read: value => value.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent),
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  static EventType = {
    STORE_UPDATE: 'STORE_UPDATE'
  };

  private subject: Subject<any> = new Subject<any>();

  private cookies = Cookies.withConverter({
    write: function (value) {
      try {
        const tmp = JSON.parse(value);
        if (typeof tmp !== 'object') {
          throw new Error()
        }
        value = 'j:' + JSON.stringify(tmp)
      } catch (e) {
      }

      return converter.write(value)
    },
    read: function (value) {
      value = converter.read(value);

      // Check if the value contains j: prefix otherwise return as is
      return value.slice(0, 2) === 'j:' ? JSON.parse(value.slice(2)) : value
    }
  });


  get observable(): Observable<any> {
    return this.subject.asObservable();
  }

  set(key: string, value: any) {
    this.cookies.set(key, value);
    this.subject.next({
      type: StoreService.EventType.STORE_UPDATE,
      payload: {key, value}
    });
  }

  get(key: string) {
    return this.cookies.get(key);
  }

  delete(cookieName) {
    Cookies.remove(cookieName);
  }

  deleteAll() {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  }
}
