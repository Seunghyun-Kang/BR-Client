import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  public companyData: Array<any> = []
  public pricesData = new Map<any, any>();
  constructor() { 
    console.log("Data service generated");
  }

  setCompanyData(data: any) {
      console.log("SET COMPANY DATA");
      this.companyData.push(data)
  }

  getCompanyData(): Array<any> {
    console.log("GET COMPANY DATA");
    return this.companyData
}
}
