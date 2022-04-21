import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private cookieService: CookieService) { }

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
