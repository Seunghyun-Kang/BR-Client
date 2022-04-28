import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagestatusService {
  private Status: BehaviorSubject<string>;
  private type: BehaviorSubject<string>;
  private galaxyOn: boolean = false

  constructor() {
    this.Status = new BehaviorSubject<string>('dashboard');
    this.type = new BehaviorSubject<string>('KRX');
  }

  getStatus(): Observable<string> {
    return this.Status.asObservable();
  }

  getType(): Observable<string> {
    return this.type.asObservable();
  }

  setStatus(newValue: string): void {
    if(newValue === "GalaxyOff") this.galaxyOn = false
    if(newValue === "GalaxyOn") this.galaxyOn = true

    this.Status.next(newValue);
  }

  setType(type: string) {
    this.type.next(type);
  }
  
  isGalaxyOn(): boolean {
    return this.galaxyOn
  }
}
