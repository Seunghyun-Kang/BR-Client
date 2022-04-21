import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  REST_SERVER_URL = 'http://52.78.240.74:8080/'
  private headers: HttpHeaders

  constructor(private http: HttpClient) {
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
  getLastBollingerTrendSignal(lastday: number, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_trend/'+ symbol +'/'  + lastday + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastBollingerReverseSignal(lastday: number, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_reverse/'+ symbol +'/'  + lastday + '/',{ observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastTripleScreenSignal(lastday: number, symbol?: string) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_triple/' + symbol +'/' + lastday + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMomentum(lastday: number, stockCount: number, symbol?: string, ) {
    if(symbol == undefined) symbol = "KRX"
    return this.http.get(this.REST_SERVER_URL + 'momentum/' + symbol +'/' + lastday + '/' + stockCount + '/', { observe: 'response', headers: this.headers })
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
