import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {AuthService} from "./services/auth.service";
import RouteNames from "./route-names";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  displayLogout = false;

  constructor(private router: Router, private authService: AuthService) {

    this.router.events.pipe(filter(value => value instanceof NavigationEnd)).subscribe(() => {
      if (window['componentHandler'] && window['componentHandler'].upgradeDom) {
        requestAnimationFrame(() => window['componentHandler'].upgradeDom())
      }
      this.displayLogout = this.authService.isAuthenticated();
    });


  }

  logout() {
    this.authService.unauthenticate();
    this.router.navigate([RouteNames.Login]);
  }
}
