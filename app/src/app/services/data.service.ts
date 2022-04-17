import { Injectable } from '@angular/core';
import { companyData } from '../components/findcompany/findcompany.component';
import { bollingerData, priceData, signalData, tripleScreenData } from '../components/stockdetail/stockdetail.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public companyData: Array<companyData> = []
  public pricesData = new Map<any, any>();
  public stockData = new Map<any, priceData[]>();
  public bollingerData = new Map<any, bollingerData[]>();
  public bollingerTrendSignalData = new Map<any, signalData[]>();
  public bollingerReverseSignalData = new Map<any, signalData[]>();
  public tripleScreenData = new Map<any, tripleScreenData[]>();
  public tripleScreenSignalData = new Map<any, signalData[]>();


  public latestTripleScreenSignalData = new Map<any, signalData[]>();
  public latestBollingerTrendSignalData = new Map<any, signalData[]>();
  public latestBollingerReverseSignalData = new Map<any, signalData[]>();

  constructor() {
    console.log("Data service generated");
  }

  setCompanyData(data: companyData[]) {
    console.log("SET COMPANY DATA");
    this.companyData = data
  }

  getCompanyData(): companyData[] {
    console.log("GET COMPANY DATA");
    console.log(this.companyData);

    return this.companyData
  }
  getCompanyNamebyCode(company: string): string {
    let selected: any
    selected = this.companyData.find(item => item.code === company)
    return selected.company
  }

  setStockData(code: string, data: priceData[]) {
    console.log("setStockData called");
    this.stockData.set(code, data)
  }
  setBollingerData(code: string, data: bollingerData[]) {
    console.log("setBollingerData called");
    this.bollingerData.set(code, data)
  }
  setBollingerTrendSignalData(code: string, data: signalData[]) {
    console.log("setBollingerTrendSignalData called");
    this.bollingerTrendSignalData.set(code, data)
  }
  setBollingerReverseSignalData(code: string, data: signalData[]) {
    console.log("setBollingerReverseSignalData called");
    this.bollingerReverseSignalData.set(code, data)
  }
  setTripleScreenData(code: string, data: tripleScreenData[]) {
    console.log("setTripleScreenData called");
    this.tripleScreenData.set(code, data)
  }
  setTripleScreenSignalData(code: string, data: signalData[]) {
    console.log("setTripleScreenSignalData called");
    this.tripleScreenSignalData.set(code, data)
  }

  getStockData(code: string): any{
    console.log("getStockData called");
    return this.stockData.get(code)
  }
  getBollingerData(code: string): any {
    console.log("getBollingerData called");
    return this.bollingerData.get(code)
  }
  getBollingerTrendSignalData(code: string): any {
    console.log("getBollingerTrendSignalData called");
    return this.bollingerTrendSignalData.get(code)
  }
  getBollingerReverseSignalData(code: string): any {
    console.log("getBollingerReverseSignalData called");
    return this.bollingerReverseSignalData.get(code)
  }
  getTripleScreenData(code: string): any {
    console.log("getTripleScreenData called");
    return this.tripleScreenData.get(code)
  }
  getTripleScreenSignalData(code: string): any {
    console.log("getTripleScreenSignalData called");
    return this.tripleScreenSignalData.get(code)
  }

  
  getLatestTripleScreenSignalData(day: number): any {
    console.log("getlatestTripleScreenSignalData called");
    return this.latestTripleScreenSignalData.get(day)
  }
  setLatestTripleScreenSignalData(day: number, data: signalData[]) {
    console.log("setlatestTripleScreenSignalData called");
    this.latestTripleScreenSignalData.set(day, data)
  }
  getLatestBollingerTrendSignalData(day: number): any {
    console.log("getLatestBollingerTrendSignalData called");
    return this.latestBollingerTrendSignalData.get(day)
  }
  setLatestBollingerTrendSignalData(day: number, data: signalData[]) {
    console.log("setlatestTripleScreenSignalData called");
    this.latestBollingerTrendSignalData.set(day, data)
  }
  getLatestBollingerReverseSignalData(day: number): any {
    console.log("getLatestBollingerReverseSignalData called");
    return this.latestBollingerReverseSignalData.get(day)
  }
  setLatestBollingerReverseSignalData(day: number, data: signalData[]) {
    console.log("setLatestBollingerReverseSignalData called");
    this.latestBollingerReverseSignalData.set(day, data)
  }

}
