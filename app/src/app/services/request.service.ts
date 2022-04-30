import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  REST_SERVER_URL = 'http://52.78.240.74:8080/'
  private headers: HttpHeaders

  constructor(private http: HttpClient,
    private loginService: LoginService) {
    this.headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET'
      }
    );
  }

  getPrices(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
  
    return this.http.get(this.REST_SERVER_URL + 'prices/'+ symbol +'/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllCompanies(symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    
    return this.http.get(this.REST_SERVER_URL + 'companylist/' + symbol + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getOptPortfolio(codes: string[], symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    let params = ""
    codes.forEach((element: any, index: number) => {
      params += element
      if (index < codes.length - 1) params += ','
    });
    let payload = { codes: params }
    return this.http.get(this.REST_SERVER_URL + 'optimalportfolio/' + symbol + '/', { observe: 'response', headers: this.headers, params: payload })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBollingerInfo(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'bollinger/' + symbol +'/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  getBollingerTrendSignal(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'bollinger_trend/'+ symbol +'/'  + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBollingerReverseSignal(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'bollinger_reverse/' + symbol +'/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTripleScreenInfo(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'triplescreen/' + symbol +'/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTripleScreenSignal(code: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'triplescreen_signal/'+ symbol +'/'  + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getLastBollingerTrendSignal(start: string, end: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_trend/'+ symbol +'/'  + start + '/' + end + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastBollingerReverseSignal(start: string, end: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_reverse/'+ symbol +'/' + start + '/' + end + '/',{ observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastTripleScreenSignal(start: string, end: string, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_triple/' + symbol +'/' + start + '/' + end + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMomentum(duration: number, symbol?: string, ) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'momentum/' + symbol +'/' + duration + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTradeHistory(duration: number, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    let phone_number = this.loginService.getNumberInCookie()
    return this.http.get(this.REST_SERVER_URL + 'trade_history/' + symbol +'/'+ phone_number +'/'+ duration + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
