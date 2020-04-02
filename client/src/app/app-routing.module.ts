import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteNames} from "./route-names";
import {HomeComponent} from "./pages/home/home.component";
import {AuthGuard} from "./guards/auth.guard";
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
  {
    component: HomeComponent,
    path: RouteNames.Home,
    canActivate: [AuthGuard]
  },
  {
    component: LoginComponent,
    path: RouteNames.Login,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
