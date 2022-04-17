import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// get() options for GET
// options: {
//   headers?: HttpHeaders | {[header: string]: string | string[]},
//   observe?: 'body' | 'events' | 'response',
//   params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
//   reportProgress?: boolean,
//   responseType?: 'arraybuffer'|'blob'|'json'|'text',
//   withCredentials?: boolean,
// }

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
    // this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8');
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

  getOptPortfolio(codes: string[]) {
    let params = ""
    codes.forEach((element: any, index: number) => {
      params += element
      if (index < codes.length - 1) params += ','
    });
    let payload = { codes: params }
    return this.http.get(this.REST_SERVER_URL + 'optimalportfolio/', { observe: 'response', headers: this.headers, params: payload })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBollingerInfo(code: string) {
    return this.http.get(this.REST_SERVER_URL + 'bollinger/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  getBollingerTrendSignal(code: string) {
    return this.http.get(this.REST_SERVER_URL + 'bollinger_trend/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBollingerReverseSignal(code: string) {
    return this.http.get(this.REST_SERVER_URL + 'bollinger_reverse/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTripleScreenInfo(code: string) {
    return this.http.get(this.REST_SERVER_URL + 'triplescreen/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTripleScreenSignal(code: string) {
    return this.http.get(this.REST_SERVER_URL + 'triplescreen_signal/' + code + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getLastBollingerTrendSignal(lastday: number) {
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_trend/' + lastday + '/', { observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastBollingerReverseSignal(lastday: number) {
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_reverse/' + lastday + '/',{ observe: 'response', headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastTripleScreenSignal(lastday: number) {
    return this.http.get(this.REST_SERVER_URL + 'latest_signal_triple/' + lastday + '/', { observe: 'response', headers: this.headers })
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
