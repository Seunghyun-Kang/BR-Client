import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private cookieService: CookieService, private route: Router) { }

  ngOnInit() {
  }

  setNumberInCookie(number: string){
    this.cookieService.set('number', number, {expires: 365});
  }

  getNumberInCookie(){
    if(this.cookieService.check('number')) return this.cookieService.get('number');
    else return undefined
  }
}
