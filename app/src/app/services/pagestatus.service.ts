import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagestatusService {
  private Status: BehaviorSubject<string>;
  private galaxyOn: boolean = true

  constructor() {
    this.Status = new BehaviorSubject<string>('dashboard');
  }

  getStatus(): Observable<string> {
    return this.Status.asObservable();
  }

  setStatus(newValue: string): void {
    if(newValue === "GalaxyOff") this.galaxyOn = false
    if(newValue === "GalaxyOn") this.galaxyOn = true

    this.Status.next(newValue);
  }

  isGalaxyOn(): boolean {
    return this.galaxyOn
  }
}
