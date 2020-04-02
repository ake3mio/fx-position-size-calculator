import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {RouteNames} from "../../route-names";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  submitError: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit({token, accountId}) {
    this.submitError = null;
    this.authService.login(accountId, token).subscribe(({success, error}) => {
      if (success) {
        this.router.navigate([`/${RouteNames.Home}`])
      } else {
        this.submitError = error;
      }
    });
  }
}
