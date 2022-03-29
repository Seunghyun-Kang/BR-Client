import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagestatusService {
  private Status: BehaviorSubject<string>;
  constructor() { 
    this.Status = new BehaviorSubject<string>('dashboard');
  }

  getStatus(): Observable<string> {
    return this.Status.asObservable();
  }
  setStatus(newValue: string): void {
    this.Status.next(newValue);
  }
}
