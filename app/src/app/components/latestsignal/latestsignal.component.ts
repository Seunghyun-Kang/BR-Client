import { Component, OnInit, ViewChild } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { DataService } from 'src/app/services/data.service';
import { signalData } from '../stockdetail/stockdetail.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-latestsignal',
  templateUrl: './latestsignal.component.html',
  styleUrls: ['./latestsignal.component.scss']
})
export class LatestsignalComponent implements OnInit {
  @ViewChild('group') group;
  public lastday: number = 3
  public money: number = 20
  public type: string
  private itemLen = 3

  public start: any
  public end: any
  public startday: any
  public endday: any
  
  public rawLatestSignalTrend: signalData[] = []
  public rawLatestSignalReverse: signalData[] = []
  public rawLatestSignalTripleScreen: signalData[] = []

  public inputDataTrend: { title: string, column: string[], data: Array<string[]>, index: number, length: number }
  public inputDataReverse: { title: string, column: string[], data: Array<string[]>, index: number, length: number }
  public inputDataTriple: { title: string, column: string[], data: Array<string[]>, index: number, length: number }
  private columnlist = IS_MOBILE ? ["종목", "종류", "신호가", "과거가", "수익률"] : ["종목", "종류", "신호일", "신호가", "과거 거래일", "과거 거래가", "수익률"]

  toppings = new FormControl(['매도']);
  toppingList: string[] = ['매수', '매도'];
  public typeSelected: string[] = ['매도'];
  public daySelected: string = "1";
  public moneySelected: string = "20";
  private companyInfo: any[] = []

  public totalRateTrend: number
  public totalRateReverse: number
  public totalRateTriple: number

  public nowPriceTrend = 0
  public pastPriceTrend = 0
  public nowPriceReverse = 0
  public pastPriceReverse = 0
  public nowPriceTriple = 0
  public pastPriceTriple = 0

  public selectedIndex = 0
  private subscription: Subscription;

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(date.getDate() - 2);
    this.end = new FormControl(new Date())
    this.start = new FormControl(date)

    let now = new Date();
    this.endday = this.datePipe.transform(now,"yyyy-MM-dd")
    this.startday = this.datePipe.transform(now.setDate(now.getDate() - 2),"yyyy-MM-dd")

    this.subscription = this.statusService.getType().subscribe((value) => {
      console.log("TYPE ::" + value);
      this.type = value

      this.resetAllData()

      this.companyInfo = this.dataService.getCompanyData(this.type)
      console.log(this.companyInfo)
      if (this.companyInfo === undefined) {
        this.requestCompanyData(this.type)
      } else {
        this.requestSignalData(this.type)
      }
    });
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy")
    this.subscription.unsubscribe()
  }

  resetAllData() {
    this.rawLatestSignalTrend = []
    this.rawLatestSignalReverse = []
    this.rawLatestSignalTripleScreen = []
    this.companyInfo = undefined
  }

  requestCompanyData(type: string) {
    this.requestService.getAllCompanies(type)
      .subscribe({
        next: (v: any) => {
          this.dataService.setCompanyData(Object(v.body), type)
          this.requestSignalData(type)
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  requestSignalData(type: string) {
    this.statusService.setStatus("loading-forward")
    this.requestService.getLastBollingerTrendSignal(this.startday, this.endday, type)
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalTrend = Object(v.body)
          // this.dataService.setLatestBollingerTrendSignalData(this.lastday, this.rawLatestSignalTrend)
          this.requestService.getLastBollingerReverseSignal(this.startday, this.endday, type)
            .subscribe({
              next: (v: any) => {
                this.rawLatestSignalReverse = Object(v.body)
                // this.dataService.setLatestBollingerReverseSignalData(this.lastday, this.rawLatestSignalReverse)
                this.requestService.getLastTripleScreenSignal(this.startday, this.endday, type)
                  .subscribe({
                    next: (v: any) => {
                      this.rawLatestSignalTripleScreen = Object(v.body)
                      // this.dataService.setLatestTripleScreenSignalData(this.lastday, this.rawLatestSignalTripleScreen)
                      this.statusService.setStatus("normal")

                      this.setDisplayDataTrend(0, this.typeSelected, this.columnlist)
                      this.setDisplayDataReverse(0, this.typeSelected, this.columnlist)
                      this.setDisplayDataTriple(0, this.typeSelected, this.columnlist)
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

  setDisplayDataTrend(page: number, typefilter: string[] = ['매수', '매도'], columnlist: string[] = []) {
    let dataArrayAll: Array<string[]> = []
    let dataArrayShow: Array<string[]> = []
    let startIndex = page * 10
    let lastIndex = startIndex + 10

    if (this.rawLatestSignalTrend !== undefined) this.rawLatestSignalTrend.forEach((element, index) => {
      if (!IS_MOBILE) {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            element.date,
            String(element.close),
            element.type === "sell" ? element.last_buy_date : element.last_sell_date,
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      } else {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            String(element.close),
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      }
    });

    this.pastPriceTrend = 0
    this.nowPriceTrend = 0
    var limit = 10000 * this.money
    dataArrayAll.forEach((element, index) => {
      if (IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[2] != "-" && element[2] != "null" && element[3] != "null") {
        var time = 1
        var price = Number(element[2])
        while (price < limit) {
          time = time + 1
          price = Number(element[2]) * time
        }
        this.nowPriceTrend = this.nowPriceTrend + price
        this.pastPriceTrend = this.pastPriceTrend + Number(element[3]) * time;
      }
      if (!IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[5] != "-" && element[5] != "null" && element[3] != "null") {
        var time = 1
        var price = Number(element[3])
        while (price < limit) {
          time = time + 1
          price = Number(element[3]) * time
        }
        this.nowPriceTrend = this.nowPriceTrend + price
        this.pastPriceTrend = this.pastPriceTrend + Number(element[5]) * time;
      }
    });
    this.totalRateTrend = Number(((this.nowPriceTrend / this.pastPriceTrend - 1) * 100).toFixed(2))


    dataArrayAll.forEach((element, index) => {
      if (index >= startIndex && index < lastIndex) {
        dataArrayShow.push(element)
      }
    });

    this.inputDataTrend = {
      title: "강승현 알고리즘",
      column: columnlist,
      data: dataArrayShow,
      index: page,
      length: Math.ceil(dataArrayAll.length / 10)
    }
  }

  setDisplayDataReverse(page: number, typefilter: string[] = ['매수', '매도'], columnlist: string[] = []) {
    let dataArrayAll: Array<string[]> = []
    let dataArrayShow: Array<string[]> = []
    let startIndex = page * 10
    let lastIndex = startIndex + 10

    if (this.rawLatestSignalReverse !== undefined) this.rawLatestSignalReverse.forEach((element, index) => {
      if (!IS_MOBILE) {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            element.date,
            String(element.close),
            element.type === "sell" ? element.last_buy_date : element.last_sell_date,
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      } else {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            String(element.close),
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      }
    });

    this.pastPriceReverse = 0
    this.nowPriceReverse = 0
    var limit = 10000 * this.money
    dataArrayAll.forEach((element, index) => {
      if (IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[2] != "-" && element[2] != "null" && element[3] != "null") {
        var time = 1
        var price = Number(element[2])
        while (price < limit) {
          time = time + 1
          price = Number(element[2]) * time
        }
        this.nowPriceReverse = this.nowPriceReverse + price
        this.pastPriceReverse = this.pastPriceReverse + Number(element[3]) * time;
      }
      if (!IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[5] != "-" && element[5] != "null" && element[3] != "null") {
        var time = 1
        var price = Number(element[3])
        while (price < limit) {
          time = time + 1
          price = Number(element[3]) * time
        }
        this.nowPriceReverse = this.nowPriceReverse + price
        this.pastPriceReverse = this.pastPriceReverse + Number(element[5]) * time;
      }
    });
    this.totalRateReverse = Number(((this.nowPriceReverse / this.pastPriceReverse - 1) * 100).toFixed(2))

    dataArrayAll.forEach((element, index) => {
      if (index >= startIndex && index < lastIndex) {
        dataArrayShow.push(element)
      }
    });

    this.inputDataReverse = {
      title: "강승현 알고리즘2",
      column: columnlist,
      data: dataArrayShow,
      index: page,
      length: Math.ceil(dataArrayAll.length / 10)
    }
  }

  setDisplayDataTriple(page: number, typefilter: string[] = ['매수', '매도'], columnlist: string[] = []) {
    let dataArrayAll: Array<string[]> = []
    let dataArrayShow: Array<string[]> = []
    let startIndex = page * 10
    let lastIndex = startIndex + 10

    if (this.rawLatestSignalTripleScreen !== undefined) this.rawLatestSignalTripleScreen.forEach((element, index) => {
      if (!IS_MOBILE) {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            element.date,
            String(element.close),
            element.type === "sell" ? element.last_buy_date : element.last_sell_date,
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      } else {
        if ((typefilter.length === 2) ||
          (typefilter.length === 1 && typefilter[0] === '매수' && element.type === 'buy') ||
          (typefilter.length === 1 && typefilter[0] === '매도' && element.type === 'sell')) {

          dataArrayAll.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            element.type === "sell" ? "매도" : "매수",
            String(element.close),
            element.type === "sell" ? element.last_buy_close !== -1 ? String(element.last_buy_close) : "-" : element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
            element.type === "buy" || element.last_buy_close === -1 ? "-" : String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
            element.code
          ])
        }
      }
    });

    this.pastPriceTriple = 0
    this.nowPriceTriple = 0
    var limit = 10000 * this.money
    dataArrayAll.forEach((element, index) => {
      if (IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[2] != "-" && element[2] != "null" && element[3] != "null") {
        var time = 1
        var price = Number(element[2])
        while (price < limit) {
          time = time + 1
          price = Number(element[2]) * time
        }
        this.nowPriceTriple = this.nowPriceTriple + price
        this.pastPriceTriple = this.pastPriceTriple + Number(element[3]) * time;
      }
      if (!IS_MOBILE && element[1] === "매도" && element[3] != "-" && element[5] != "-" && element[5] !== "null" && element[3] !== "null") {
        var time = 1
        var price = Number(element[3])
        while (price < limit) {
          time = time + 1
          price = Number(element[3]) * time
        }
        this.nowPriceTriple = this.nowPriceTriple + price
        this.pastPriceTriple = this.pastPriceTriple + Number(element[5]) * time;
      }
    });
    this.totalRateTriple = Number(((this.nowPriceTriple / this.pastPriceTriple - 1) * 100).toFixed(2))

    dataArrayAll.forEach((element, index) => {
      if (index >= startIndex && index < lastIndex) {
        dataArrayShow.push(element)
      }
    });

    this.inputDataTriple = {
      title: "삼중창 알고리즘",
      column: columnlist,
      data: dataArrayShow,
      index: page,
      length: Math.ceil(dataArrayAll.length / 10)
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

  onChangeType(event: any) {
    this.typeSelected = event.value

    this.setDisplayDataTrend(0, this.typeSelected, this.columnlist)
    this.setDisplayDataReverse(0, this.typeSelected, this.columnlist)
    this.setDisplayDataTriple(0, this.typeSelected, this.columnlist)
  }

  onChangeDay(event: any) {
    console.log(event.value)

    switch (Number(event.value)) {
      case 1: { this.lastday = 3; this.daySelected = event.value; break; }
      case 2: { this.lastday = 7; this.daySelected = event.value; break; }
      case 3: { this.lastday = 14; this.daySelected = event.value; break; }
      case 4: { this.lastday = 30; this.daySelected = event.value; break; }
      case 5: { this.lastday = 180; this.daySelected = event.value; break; }
      case 6: { this.lastday = 360; this.daySelected = event.value; break; }
      default: break;
    }

    this.rawLatestSignalTrend = this.dataService.getLatestBollingerTrendSignalData(this.lastday)
    if (this.rawLatestSignalTrend === undefined) {
      this.requestSignalData(this.type)
    }
    this.rawLatestSignalReverse = this.dataService.getLatestBollingerReverseSignalData(this.lastday)
    if (this.rawLatestSignalReverse === undefined) {
      this.requestSignalData(this.type)
    }
    this.rawLatestSignalTripleScreen = this.dataService.getLatestTripleScreenSignalData(this.lastday)
    if (this.rawLatestSignalTripleScreen === undefined) {
      this.requestSignalData(this.type)
    }

    this.setDisplayDataTrend(0, this.typeSelected, this.columnlist)
    this.setDisplayDataReverse(0, this.typeSelected, this.columnlist)
    this.setDisplayDataTriple(0, this.typeSelected, this.columnlist)
  }

  onChangeMoney(event: any) {
    console.log(event.value)

    switch (Number(event.value)) {
      case 10: { this.money = 10; this.moneySelected = event.value; break; }
      case 20: { this.money = 20; this.moneySelected = event.value; break; }
      case 30: { this.money = 30; this.moneySelected = event.value; break; }
      case 50: { this.money = 50; this.moneySelected = event.value; break; }
      case 100: { this.money = 100; this.moneySelected = event.value; break; }
      default: break;
    }

    this.setDisplayDataTrend(0, this.typeSelected, this.columnlist)
    this.setDisplayDataReverse(0, this.typeSelected, this.columnlist)
    this.setDisplayDataTriple(0, this.typeSelected, this.columnlist)
  }

  onSwipeRight(event: any) {
    console.log("RIGHT")
    if (this.selectedIndex !== 0) { this.selectedIndex = this.selectedIndex - 1; this.group.focusTab(this.selectedIndex) }

  }
  onSwipeLeft(event: any) {
    console.log("Left")
    if (this.selectedIndex !== this.itemLen - 1) {
      this.selectedIndex = this.selectedIndex + 1
      this.group.focusTab(this.selectedIndex)
    }
  }

  onTapNext(page: number, total: number, type: number) {
    console.log(page)
    if (page >= total) return

    if(type == 1) this.setDisplayDataTrend(page, this.typeSelected, this.columnlist)
    else if (type == 2) this.setDisplayDataReverse(page, this.typeSelected, this.columnlist)
    else if (type == 3) this.setDisplayDataTriple(page, this.typeSelected, this.columnlist)
  }
  onTapPrev(page: number, total: number, type: number) {
    console.log(page)
    if (page < 0) return
    
    if(type == 1) this.setDisplayDataTrend(page, this.typeSelected, this.columnlist)
    else if (type == 2) this.setDisplayDataReverse(page, this.typeSelected, this.columnlist)
    else if (type == 3) this.setDisplayDataTriple(page, this.typeSelected, this.columnlist)
  }

  startDateChange(event: any) {
    this.startday = this.datePipe.transform(event.value,"yyyy-MM-dd")
    console.log(this.datePipe.transform(event.value,"yyyy-MM-dd"))
    
    this.requestSignalData(this.type)
  }

  endDateChange(event: any) {
    this.endday = this.datePipe.transform(event.value,"yyyy-MM-dd")
    console.log(this.datePipe.transform(event.value,"yyyy-MM-dd"))

    this.requestSignalData(this.type)
  }
}
