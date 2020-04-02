import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {WebsocketBuilder} from "../core/websocket/websocket-builder";

@Injectable()
export class WebsocketService implements OnDestroy {
  private unsubscribe$ = new Subject();
  private socket: WebSocket;


  observe<T>({
               url,
               retries,
               retryDelay,
               errorHandler,
               fatalErrorHandler
             }): Observable<T> {

    const builder = new WebsocketBuilder(url);

    return builder
      .withTakeUntil(this.unsubscribe$)
      .withRetries(retries)
      .withRetryDelay(retryDelay)
      .withFatalErrorHandler(fatalErrorHandler)
      .withErrorHandler(errorHandler)
      .build<T>(this.createSocket);

  }

  send(payload) {
    try {
      this.socket.send(JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  }

  closeSocket() {
    this.socket.close();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnDestroy(): void {
    this.closeSocket();
  }

  private createSocket = (url: string) => {

    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(url);

    return this.socket;
  };
}
