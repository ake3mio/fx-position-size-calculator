import {Injectable} from '@angular/core';
import {from, Observable, of} from "rxjs";
import {
  concatMap,
  delay,
  filter,
  finalize,
} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private dialog: HTMLDialogElement;


  constructor(router: Router) {

    router.events.pipe(filter(value => value instanceof NavigationEnd)).subscribe(() => {
      const root = document.createElement('div');
      root.innerHTML = this.getTemplate();

      this.dialog = root.querySelector('.mdl-dialog');

      if (this.dialog && !this.dialog.showModal && window['dialogPolyfill']) {
        window['dialogPolyfill'].registerDialog(this.dialog);
      }

      document.body.appendChild(root);
    });
  }

  public sequence(title: string, text: string[], timeout: number): Observable<void> {

    return new Observable(subscriber => {
      this.dialog.showModal();
      from(text).pipe(
        concatMap(x => of(this.notify(title, x)).pipe(delay(timeout))),
        finalize(() => {
          this.dialog.close();

          setTimeout(() => {
            subscriber.next();
            subscriber.complete();
          }, timeout);
        })
      ).subscribe()
    });
  }

  private notify(title: string, text: string) {
    this.dialog.querySelector(".mdl-dialog__title").innerHTML = title;
    this.dialog.querySelector(".mdl-dialog__content").innerHTML = text;
  }

  getTemplate() {
    return `
  <dialog class="mdl-dialog">
    <strong class="mdl-dialog__title" style="text-align: center; font-size: 16px; display: block">Notification</strong>
    <div class="mdl-dialog__content" style="text-align: center; font-weight: bold; font-size: 24px">
        Allowing us to collect data will let us get you the information you want faster.
    </div>
  </dialog>
    `
  }
}
