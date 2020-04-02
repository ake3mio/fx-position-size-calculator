import {Inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {HeaderName} from "../../../../common/auth";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    @Inject('BASE_API_URL') private baseUrl: string) {
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const url = new URL(this.baseUrl);

    url.pathname = request.url;

    const update = {
      url: url.href,
      headers: undefined
    };

    const currentUser = this.authService.getCurrentUserAuth();

    if (currentUser) {
      update.headers = request.headers.set(HeaderName.Authorization, currentUser);
    }

    const apiReq = request.clone(update);

    return next.handle(apiReq);
  }
}
