import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeEnGb from '@angular/common/locales/en-GB';
import 'material-design-lite'

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StoreService} from "./services/store.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './pages/login/login.component';
import {AuthService} from "./services/auth.service";
import {ApiInterceptor} from "./interceptors/api.interceptor";
import {environment} from "../environments/environment";
import {NotificationService} from "./services/notification.service";
import {AccountFormComponent} from './components/account-form/account-form.component';
import {InstrumentsFormComponent} from './components/instruments-form/instruments-form.component';
import { InstrumentsWatchComponent } from './components/instruments-watch/instruments-watch.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

registerLocaleData(localeEnGb);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AccountFormComponent,
    InstrumentsFormComponent,
    InstrumentsWatchComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    NotificationService,
    StoreService,
    AuthService,
    {provide: LOCALE_ID, useValue: "en-GB"},
    {provide: "API_WEBSOCKET_URL", useValue: environment.websocketUrl},
    {provide: "BASE_API_URL", useValue: environment.apiUrl},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
