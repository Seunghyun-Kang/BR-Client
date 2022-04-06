import { Injectable } from '@angular/core';
import { companyData } from '../components/findcompany/findcompany.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public companyData: Array<companyData> = []
  public pricesData = new Map<any, any>();
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
}
