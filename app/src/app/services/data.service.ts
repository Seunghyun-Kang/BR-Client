import { Injectable } from '@angular/core';
import { companyData } from '../components/findcompany/findcompany.component';
import { bollingerData, priceData, signalData, tripleScreenData, momentumData } from '../components/stockdetail/stockdetail.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public companyData = new Map<any, companyData[]>();
  public pricesData = new Map<any, any>();
  public stockData = new Map<any, priceData[]>();
  public bollingerData = new Map<any, bollingerData[]>();
  public bollingerTrendSignalData = new Map<any, signalData[]>();
  public bollingerReverseSignalData = new Map<any, signalData[]>();
  public tripleScreenData = new Map<any, tripleScreenData[]>();
  public tripleScreenSignalData = new Map<any, signalData[]>();

  private momentum3 = new Map<any, momentumData[]>();
  private momentum6 = new Map<any, momentumData[]>();
  private momentum9 = new Map<any, momentumData[]>();
  private momentum12 = new Map<any, momentumData[]>();

  public latestTripleScreenSignalData = new Map<any, signalData[]>();
  public latestBollingerTrendSignalData = new Map<any, signalData[]>();
  public latestBollingerReverseSignalData = new Map<any, signalData[]>();

  constructor() {
    console.log("Data service generated");
  }

  setCompanyData(data: companyData[], type?: string) {
    if(type === undefined) type = "KRX"
    this.companyData.set(type, data)
  }

  getCompanyData(type?: string): companyData[] {
    if(type === undefined) type = "KRX"
    return this.companyData.get(type)
  }

  getCompanyNamebyCode(company: string, type?: string): string {
    if(type === undefined) type = "KRX"
    let selected: any
    selected = this.companyData.get(type).find(item => item.code === company)
    return selected.company
  }

  setStockData(code: string, data: priceData[]) {
    this.stockData.set(code, data)
  }
  setBollingerData(code: string, data: bollingerData[]) {
    this.bollingerData.set(code, data)
  }
  setBollingerTrendSignalData(code: string, data: signalData[]) {
    this.bollingerTrendSignalData.set(code, data)
  }
  setBollingerReverseSignalData(code: string, data: signalData[]) {
    this.bollingerReverseSignalData.set(code, data)
  }
  setTripleScreenData(code: string, data: tripleScreenData[]) {
    this.tripleScreenData.set(code, data)
  }
  setTripleScreenSignalData(code: string, data: signalData[]) {
    this.tripleScreenSignalData.set(code, data)
  }

  getStockData(code: string): any{
    // console.log("getStockData called");
    return this.stockData.get(code)
  }
  getBollingerData(code: string): any {
    // console.log("getBollingerData called");
    return this.bollingerData.get(code)
  }
  getBollingerTrendSignalData(code: string): any {
    // console.log("getBollingerTrendSignalData called");
    return this.bollingerTrendSignalData.get(code)
  }
  getBollingerReverseSignalData(code: string): any {
    // console.log("getBollingerReverseSignalData called");
    return this.bollingerReverseSignalData.get(code)
  }
  getTripleScreenData(code: string): any {
    // console.log("getTripleScreenData called");
    return this.tripleScreenData.get(code)
  }
  getTripleScreenSignalData(code: string): any {
    // console.log("getTripleScreenSignalData called");
    return this.tripleScreenSignalData.get(code)
  }

  
  getLatestTripleScreenSignalData(day: number): any {
    // console.log("getlatestTripleScreenSignalData called");
    return this.latestTripleScreenSignalData.get(day)
  }
  setLatestTripleScreenSignalData(day: number, data: signalData[]) {
    // console.log("setlatestTripleScreenSignalData called");
    this.latestTripleScreenSignalData.set(day, data)
  }
  getLatestBollingerTrendSignalData(day: number): any {
    // console.log("getLatestBollingerTrendSignalData called");
    return this.latestBollingerTrendSignalData.get(day)
  }
  setLatestBollingerTrendSignalData(day: number, data: signalData[]) {
    // console.log("setlatestTripleScreenSignalData called");
    this.latestBollingerTrendSignalData.set(day, data)
  }
  getLatestBollingerReverseSignalData(day: number): any {
    // console.log("getLatestBollingerReverseSignalData called");
    return this.latestBollingerReverseSignalData.get(day)
  }
  setLatestBollingerReverseSignalData(day: number, data: signalData[]) {
    // console.log("setLatestBollingerReverseSignalData called");
    this.latestBollingerReverseSignalData.set(day, data)
  }
  
  getMomentumData(lastday: number, type?: string): momentumData[] {
    if(type === undefined) type = "KRX"

    if(lastday === 90) return this.momentum3.get(type)
    else if(lastday === 180) return this.momentum6.get(type)
    else if(lastday === 270) return this.momentum9.get(type)
    else if(lastday === 360) return this.momentum12.get(type)
  }

  setMomentumData(data: momentumData[], lastday: number, type?: string) {
    if(type === undefined) type = "KRX"
    
    if(lastday === 90) this.momentum3.set(type, data)
    else if(lastday === 180) this.momentum6.set(type, data)
    else if(lastday === 270) this.momentum9.set(type, data)
    else if(lastday === 360) this.momentum12.set(type, data)
  }
}
