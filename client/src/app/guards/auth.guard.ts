import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {RouteNames} from "../route-names";
import {AuthService} from "../services/auth.service";
import {flatMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.checkAuthenticated().pipe(flatMap(value => {

      const isAuthenticated = value.success;

      if (state.url.match(RouteNames.Login)) {
        return this.validateLoginPage(isAuthenticated);
      }

      return this.validateDefault(isAuthenticated);
    }));
  }

  private validateDefault(isAuthenticated: boolean) {
    if (!isAuthenticated) {

      this.router.navigate(['/login']);

      return of(false);
    }

    return of(isAuthenticated);

  }

  private validateLoginPage(isAuthenticated: boolean) {

    if (!isAuthenticated) {
      return of(true);
    } else {
      this.router.navigate([RouteNames.Home]);
      return of(false);
    }
  }

}
