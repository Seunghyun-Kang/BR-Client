import { Component, OnInit } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { DataService } from 'src/app/services/data.service';
import { signalData } from '../stockdetail/stockdetail.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-latestsignal',
  templateUrl: './latestsignal.component.html',
  styleUrls: ['./latestsignal.component.scss']
})
export class LatestsignalComponent implements OnInit {
  public lastday: number = 3

  public rawLatestSignalTrend: signalData[] = []
  public rawLatestSignalReverse: signalData[] = []
  public rawLatestSignalTripleScreen: signalData[] = []

  public inputDataTrend: {title: string, column: string[], data: Array<string[]>}
  public inputDataReverse: {title: string, column: string[], data: Array<string[]>}
  public inputDataTriple: {title: string, column: string[], data: Array<string[]>}

  toppings = new FormControl(['매수', '매도']);
  toppingList: string[] = ['매수', '매도'];
  public typeSelected: string[] = ['매수', '매도'];
  public daySelected: string = "1";
  private companyInfo: any[] = []
  
  public selectedIndex = 0

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private router: Router,
  ) {
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {
    this.companyInfo = this.dataService.getCompanyData()
    if (this.companyInfo.length === 0) {
      this.requestCompanyData()
    } else {
      this.rawLatestSignalTrend = this.dataService.getLatestBollingerTrendSignalData(3)
      if (this.rawLatestSignalTrend.length === 0) {
        this.requestSignalData()
      }
    }
  }

  requestCompanyData() {
    this.requestService.getAllCompanies()
      .subscribe({
        next: (v: any) => {
          this.dataService.setCompanyData(Object(v.body))
          this.requestSignalData()
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  requestSignalData() {
    this.requestService.getLastBollingerTrendSignal(this.lastday)
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalTrend = Object(v.body)
          this.dataService.setLatestBollingerTrendSignalData(this.lastday, this.rawLatestSignalTrend)
          this.requestService.getLastBollingerReverseSignal(this.lastday)
            .subscribe({
              next: (v: any) => {
                this.rawLatestSignalReverse = Object(v.body)
                this.dataService.setLatestBollingerReverseSignalData(this.lastday, this.rawLatestSignalReverse)
                this.requestService.getLastTripleScreenSignal(this.lastday)
                  .subscribe({
                    next: (v: any) => {
                      this.rawLatestSignalTripleScreen = Object(v.body)
                      this.dataService.setLatestTripleScreenSignalData(this.lastday, this.rawLatestSignalTripleScreen)
                      this.statusService.setStatus("normal")
                      this.parseDataForList(this.typeSelected)
                    },
                    error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                  });
              },
              error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
            });
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
}

parseDataForList(typefilter: string[] = ['매수', '매도']) {
  console.log(this.typeSelected)
  let columnlist = IS_MOBILE ? ["종목", "종류", "신호가", "과거가", "수익률"] : ["종목","종류", "신호일", "신호가", "과거 거래일", "과거 거래가", "수익률"]

  let dataArrayTrend: Array<string[]> = []
  let dataArrayReverse: Array<string[]> = []
  let dataArrayTriple: Array<string[]> = []

  this.rawLatestSignalTrend.forEach(element => {
      if (!IS_MOBILE){ 
        if((typefilter.length === 2) || 
        (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
        (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
        
        dataArrayTrend.push([
        this.dataService.getCompanyNamebyCode(element.code),
        element.type === "sell" ? "매도" : "매수",
        element.date,
        String(element.close),
        element.type === "sell" ? element.last_buy_date : element.last_sell_date,
        element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
        element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
        element.code
      ])
    }
    } else {
      if((typefilter.length === 2) || 
      (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
      (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
      
        dataArrayTrend.push([
        this.dataService.getCompanyNamebyCode(element.code),
        element.type === "sell" ? "매도" : "매수",
        String(element.close),
        element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
        element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
        element.code
      ])
    }
    }
  });

  this.rawLatestSignalReverse.forEach(element => {
    if (!IS_MOBILE){ 
      if((typefilter.length === 2) || 
      (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
      (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
      
      dataArrayReverse.push([
      this.dataService.getCompanyNamebyCode(element.code),
      element.type === "sell" ? "매도" : "매수",
      element.date,
      String(element.close),
      element.type === "sell" ? element.last_buy_date : element.last_sell_date,
      element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
      element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
      element.code
    ])
  }
  } else {
    if((typefilter.length === 2) || 
    (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
    (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
    
      dataArrayReverse.push([
      this.dataService.getCompanyNamebyCode(element.code),
      element.type === "sell" ? "매도" : "매수",
      String(element.close),
      element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
      element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
      element.code
    ])
  }
  }
});

this.rawLatestSignalTripleScreen.forEach(element => {
  if (!IS_MOBILE){ 
    if((typefilter.length === 2) || 
    (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
    (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
    
    dataArrayTriple.push([
    this.dataService.getCompanyNamebyCode(element.code),
    element.type === "sell" ? "매도" : "매수",
    element.date,
    String(element.close),
    element.type === "sell" ? element.last_buy_date : element.last_sell_date,
    element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
    element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
    element.code
  ])
}
} else {
  if((typefilter.length === 2) || 
  (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
  (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')){
  
    dataArrayTriple.push([
    this.dataService.getCompanyNamebyCode(element.code),
    element.type === "sell" ? "매도" : "매수",
    String(element.close),
    element.type === "sell" ? String(element.last_buy_close) : String(element.last_sell_close),
    element.type === "buy" ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
    element.code
  ])
}
}
});

  this.inputDataTrend = {
      title: "볼린저 추세 추동 매도 신호",
      column: columnlist,
      data: dataArrayTrend
    }

    this.inputDataReverse = {
      title: "볼린저 반전 매매 매수 신호",
      column: columnlist,
      data: dataArrayReverse
    }

    this.inputDataTriple = {
      title: "삼중창 매수 신호",
      column: columnlist,
      data: dataArrayTriple
    }
}

onTapCompany(code: string, company: string) {
  this.router.navigate(['stockdetail'], {
    queryParams: {
      code: code,
      companyName: company
    }
  })
}

onChangeType(event: any){
  this.typeSelected = event.value
  console.log(this.typeSelected)
  this.parseDataForList(this.typeSelected)
}

onChangeDay(event: any){
  console.log(event.value)

  switch(Number(event.value)){
    case 1: {this.lastday = 3; this.daySelected= event.value; break;}
    case 2: {this.lastday = 7; this.daySelected= event.value; break;}
    case 3: {this.lastday = 14; this.daySelected= event.value; break;}
    default: break;
  }

  console.log(this.lastday)

  this.rawLatestSignalTrend = this.dataService.getLatestBollingerTrendSignalData(this.lastday)
  console.log(this.rawLatestSignalTrend)
      if (this.rawLatestSignalTrend === undefined) {
        this.requestSignalData()
  }
  this.rawLatestSignalReverse = this.dataService.getLatestBollingerReverseSignalData(this.lastday)
      if (this.rawLatestSignalReverse === undefined) {
        this.requestSignalData()
  }
  this.rawLatestSignalTripleScreen = this.dataService.getLatestTripleScreenSignalData(this.lastday)
      if (this.rawLatestSignalTripleScreen === undefined) {
        this.requestSignalData()
  }
}
}
