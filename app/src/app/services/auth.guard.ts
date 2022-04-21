import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService : LoginService, private route: Router) {
  }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var info : any = this.loginService.getNumberInCookie();
    if(info != undefined){
      return true;
    }

    this.route.navigateByUrl('home');
    return false;
  }
  
}
