import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {StoreService} from "./store.service";
import {Observable, ObservableInput, of} from "rxjs";
import {catchError, flatMap} from "rxjs/operators";
import {StoreName} from "../../../../common/auth";

export type ValidateResponse = { success: boolean, error?: HttpErrorResponse };

type Response = { success: boolean, error?: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AuthSeparator = ":";

  constructor(private http: HttpClient, private storeService: StoreService) {
  }

  login(accountId: string, token: string): Observable<Response> {

    const handleResponse = flatMap<ValidateResponse, ObservableInput<Response>>(value => {

      if (value && value.success) {

        this.storeService.set(StoreName.Authorization, btoa(accountId + this.AuthSeparator + token));

        return of({success: true});
      }

      this.storeService.delete(StoreName.Authorization);

      if (value.error && value.error.statusText === 'Unknown Error') {
        return of({
          success: false,
          error: "There has been an underlying system fault. Please refresh and try again or come back later."
        });
      }

      return of({
        success: false,
        error: "Account ID or Api Token is invalid"
      });
    });

    return this.validate(accountId, token).pipe(handleResponse);
  }

  isAuthenticated() {
    return !!this.storeService.get(StoreName.Authorization);
  }

  getCurrentUserAuth() {
    return this.storeService.get(StoreName.Authorization);
  }

  getCurrentUser() {

    const auth = this.storeService.get(StoreName.Authorization);

    if (typeof auth === 'string') {

      const [accountId, token] = atob(this.getCurrentUserAuth()).split(this.AuthSeparator);

      return {
        accountId,
        token
      };
    }

    return {};
  }

  checkAuthenticated(): Observable<ValidateResponse> {
    const auth = this.storeService.get(StoreName.Authorization);
    if (typeof auth === 'string') {
      const {accountId, token} = this.getCurrentUser();
      return this.validate(accountId, token);
    }

    return of({success: false});
  }

  private validate(accountId: string, token: string): Observable<ValidateResponse> {
    return this.http.post<ValidateResponse>("/auth/validate", {accountId, token}).pipe(
      catchError(error => of({success: false, error}))
    );
  }

  unauthenticate() {
    this.storeService.delete(StoreName.Authorization);
  }
}
