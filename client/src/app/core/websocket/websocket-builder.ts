import {Observable, of} from "rxjs";
import {delay, finalize, map, retryWhen, take, takeUntil} from "rxjs/operators";

export class WebsocketBuilder {
  private fatalErrorHandler: () => void;
  private errorHandler: (next: () => void) => void;
  private retries: number = 5;
  private retryDelay: number = 1000;
  private takeUntil: Observable<any>;

  constructor(private url: string) {
  }

  withTakeUntil(takeUntil: Observable<any>) {
    this.takeUntil = takeUntil;
    return this;
  }

  withRetries(retries: number) {
    this.retries = retries;
    return this;
  }

  withRetryDelay(retryDelay: number) {
    this.retryDelay = retryDelay;
    return this;
  }

  withErrorHandler(errorHandler: (next: () => void) => void) {
    this.errorHandler = errorHandler;
    return this;
  }

  withFatalErrorHandler(fatalErrorHandler: () => void) {
    this.fatalErrorHandler = fatalErrorHandler;
    return this;
  }

  build<T>(socketFactory: (url: string) => WebSocket) {
    return new Observable<T>(observer => {

      const socket = socketFactory(this.url);

      socket.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };

      socket.onopen = () => {
        console.info("[open] Socket connection established at: " + this.url);
      };

      socket.onclose = (event) => {

        if (event.wasClean) {

          console.info(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);

        } else if (this.errorHandler) {
          this.errorHandler(() => observer.error());
        }
      };

      socket.onerror = () => {
        if (this.errorHandler) {
          this.errorHandler(() => observer.error());
        }
      };
    }).pipe(
      takeUntil(this.takeUntil),
      retryWhen(result =>
        result.pipe(
          map(() => of(true)),
          delay(this.retryDelay),
          take(this.retries),
          finalize(this.fatalErrorHandler)
        )
      )
    );
  }
}
