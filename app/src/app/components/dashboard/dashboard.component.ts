import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { signalData, momentumData } from '../stockdetail/stockdetail.model';
import { MatDialog } from '@angular/material/dialog';
import { ListComponent } from 'src/app/modules/list/list.component';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export interface TradeData {
  id: string,
  code: string,
  date: string,
  type: string,
  num: number,
  price: number
}
@Component({
  selector: 'app-menu',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  public getTrendData: boolean = false
  public getReverseData: boolean = false
  public getTripleScreenData: boolean = false
  public getMomentumData: boolean = false

  public status = "loading-forward";
  public type: string = "KRX"
  public unit: string = "원"

  public rawLatestSignalTrend: signalData[] = []
  public rawLatestSignalReverse: signalData[] = []
  public rawLatestSignalTripleScreen: signalData[] = []
  public rawTradeHistory: TradeData[] = []
  public rawMomentum: any

  public buyTrend: Array<string[]> = []
  public buyReverse: Array<string[]> = []
  public buyTriple: Array<string[]> = []
  public sellTrend: Array<string[]> = []
  public sellReverse: Array<string[]> = []
  public sellTriple: Array<string[]> = []
  public momentumData: Array<momentumData> = []
  public momentumData5: Array<momentumData> = []

  private companyInfo: any[] = []
  private subscription: Subscription;
  private start: any
  private end: any

  public tooltipTrend = "알고리즘 815"
  public tooltipReverse = "알고리즘 220522"
  public tooltipTriple = "첫번째 창으로 추세를 판단, 두번재 창으로 추세에 반하는 움직임을 판단, 세번째에 진입 시점을 판단하여 매수/매도"
  public tooltipMomentum = "3~12개월 동안의 강세주들이 이후 동일한 기간 동안에도 강세주라는 전략. 기간이 길어질수록 더 확실하다."

  constructor(private statusService: PagestatusService,
    private router: Router,
    private requestService: RequestService,
    private dataService: DataService,
    public dialog: MatDialog,
    private datePipe: DatePipe) {
      console.log("DASHBOARD CONSTRUCTOR")
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {
    this.subscription = this.statusService.getType().subscribe((value) => {
      console.log("TYPE ::" + value);
      this.type = value

      if (value == "NASDAQ") this.unit = "달러"
      if (value == "KRX" || value == "COIN") this.unit = "원"

      this.resetAllData()

      this.companyInfo = this.dataService.getCompanyData(this.type)
      console.log(this.companyInfo)
      if (this.companyInfo === undefined) {
        this.requestCompanyData(this.type)
      } else {
        this.requestSignalData(this.type)
        this.momentumData = this.dataService.getMomentumData(90, this.type)
        if (this.momentumData === undefined) {this.requestMomentum(this.type); this.momentumData = []}
        else {
          this.momentumData.forEach((element,index) => {
            if(index <5) this.momentumData5.push(element)
          });
        }

        // this.requestTradeHistory(this.type)
        // this.momentumData = this.dataService.getMomentumData(90, this.type)
        // if (this.momentumData === undefined) {this.requestMomentum(this.type); this.momentumData = []}
        // else {
        //   this.momentumData.forEach((element,index) => {
        //     if(index <5) this.momentumData5.push(element)
        //   });
        // }
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
    this.rawMomentum = []

    this.buyTrend = []
    this.buyReverse = []
    this.buyTriple = []
    this.sellTrend = []
    this.sellReverse = []
    this.sellTriple = []
    this.companyInfo = undefined

    this.momentumData = []
    this.momentumData5 = []

    this.getTrendData = false
    this.getReverseData = false
    this.getTripleScreenData = false
    this.getMomentumData = false
  }

  requestCompanyData(type: string) {
    this.requestService.getAllCompanies(type)
      .subscribe({
        next: (v: any) => {
          this.dataService.setCompanyData(Object(v.body), type)
          this.requestSignalData(type)
          this.momentumData = this.dataService.getMomentumData(90, this.type)
          if (this.momentumData === undefined) {this.requestMomentum(this.type); this.momentumData = []}
          // this.requestTradeHistory(this.type)
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  requestMomentum(type: string) {
    this.requestService.getMomentum(90, type)
      .subscribe({
        next: (v: any) => {
          Object(v.body).sort((a, b) => b.returns - a.returns)
          this.rawMomentum = Object(v.body)
          console.log(this.rawMomentum)
          this.parseMomentum(this.rawMomentum)
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  requestTradeHistory(type: string) {
    this.requestService.getTradeHistory(365, type)
      .subscribe({
        next: (v: any) => {
          this.rawTradeHistory = Object(v.body)
          console.log(this.rawTradeHistory)
          this.parseTradeHistory(this.rawTradeHistory)
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  private getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  }

  requestSignalData(type: string) {
    let now = new Date(); 
    if (type=="NASDAQ") {
      now = this.getNowUTC()
    }
    this.end = this.datePipe.transform(now, "yyyy-MM-dd")
    switch (now.getDay()) {
      case 0: // sunday
        this.start = this.datePipe.transform(now.setDate(now.getDate() - 2), "yyyy-MM-dd")
        break;
      case 1: //mon
        if (now.getHours() < 16) {
          this.start = this.datePipe.transform(now.setDate(now.getDate() - 3), "yyyy-MM-dd")
        } else {
          this.start = this.datePipe.transform(now, "yyyy-MM-dd")
        }
        break;
      case 6: //saturday
        this.start = this.datePipe.transform(now.setDate(now.getDate() - 1), "yyyy-MM-dd")
        break;
      default:
        if (now.getHours() < 16) {
          this.start = this.datePipe.transform(now.setDate(now.getDate() - 1), "yyyy-MM-dd")
        } else {
          this.start = this.datePipe.transform(now, "yyyy-MM-dd")
        }
    }
    console.log(this.start)
    console.log(this.end)
    this.requestService.getLastBollingerTrendSignal(this.start, this.end, type)
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalTrend = Object(v.body)
          console.log(this.rawLatestSignalTrend)
          this.parseSignalData(this.rawLatestSignalTrend, "bollinger-trend")

          this.requestService.getLastBollingerReverseSignal(this.start, this.end, type)
            .subscribe({
              next: (v: any) => {
                this.rawLatestSignalReverse = Object(v.body)
                console.log(this.rawLatestSignalReverse)
                this.parseSignalData(this.rawLatestSignalReverse, "bollinger-reverse")
                      this.statusService.setStatus("normal")

                // this.requestService.getLastTripleScreenSignal(this.start, this.end, type)
                //   .subscribe({
                //     next: (v: any) => {
                //       this.rawLatestSignalTripleScreen = Object(v.body)
                //       console.log(this.rawLatestSignalTripleScreen)
                //       this.parseSignalData(this.rawLatestSignalTripleScreen, "triplescreen")
                //       this.statusService.setStatus("normal")
                //     },
                //     error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                //   });
              },
              error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
            });
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  openDialog(type: string) {
    let dataArray: Array<string[]> = []
    let title = ""
    let columnlist = IS_MOBILE ? ["종목", "신호가", "과거가", "수익률"] : ["종목", "신호일", "신호가", "과거 거래일", "과거 거래가", "수익률"]

    switch (type) {
      case "buyTrend":
        this.rawLatestSignalTrend.forEach(element => {
          title = "알고리즘815 매수 신호"
          if (element.type === "buy" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              element.date,
              String(element.close),
              element.last_sell_date,
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              String(element.close),
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",
              "-",
              element.code
            ])
          }
        });
        break;
      case "buyReverse":
        title = "알고리즘923 매수 신호"
        this.rawLatestSignalReverse.forEach(element => {
          if (element.type === "buy" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              element.date,
              String(element.close),
              element.last_sell_date,
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",

              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              String(element.close),
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",

              "-",
              element.code
            ])
          }
        });
        break;
      case "buyTriple":
        title = "삼중창 매수 신호"

        this.rawLatestSignalTripleScreen.forEach(element => {
          if (element.type === "buy" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type),
              element.date,
              String(element.close),
              element.last_sell_date,
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",

              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type),
              String(element.close),
              element.last_sell_close !== -1 ? String(element.last_sell_close) : "-",

              "-",
              element.code
            ])
          }
        });
        break;
      case "sellTrend":
        title = "알고리즘815 매도 신호"

        this.rawLatestSignalTrend.forEach(element => {
          if (element.type === "sell" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              element.date,
              String(element.close),
              element.last_buy_date,
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              String(element.close),
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
          }
        });
        break;
      case "sellReverse":
        title = "알고리즘923 매도 신호"

        this.rawLatestSignalReverse.forEach(element => {
          if (element.type === "sell" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              element.date,
              String(element.close),
              element.last_buy_date,
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type) + ' (' + element.code + ')',
              String(element.close),
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
          }
        });
        break;
      case "sellTriple":
        title = "테스트  알고리즘 매도 신호"

        this.rawLatestSignalTripleScreen.forEach(element => {
          if (element.type === "sell" && element.valid === "valid") {
            if (!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type),
              element.date,
              String(element.close),
              element.last_buy_date,
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type),
              String(element.close),
              element.last_buy_close !== -1 ? String(element.last_buy_close) : "-",
              element.last_buy_close !== -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) : "-",
              element.code
            ])
          }
        });
        break;

      default:
        break
    }

    this.dialog.open(ListComponent, {
      width: '80vw',
      height: '80vh',
      data: {
        title: title,
        column: columnlist,
        data: dataArray
      },
    });
  }

  parseTradeHistory(data: TradeData[]) {

  }

  parseSignalData(data: signalData[], type: string) {
    switch (type) {
      case "bollinger-trend":
        data.forEach(element => {
          if (element.type === "buy") this.buyTrend.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            "전일 종가 " + String(element.close) + this.unit,
          ])
          else {
            this.sellTrend.push([
              this.dataService.getCompanyNamebyCode(element.code, this.type),
              "전일 종가 " + String(element.close) + this.unit,
              element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" : "정보 없음",
              element.last_buy_close != -1 ? "  " + " (매수가 " + String(element.last_buy_close) + this.unit + ")" : "",
              String((element.close - element.last_buy_close) / element.last_buy_close * 100)
            ])
          }
        });
        this.getTrendData = true
        break;
      case "bollinger-reverse":
        data.forEach(element => {
          if (element.type === "buy") this.buyReverse.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            "전일 종가 " + String(element.close) + this.unit,
          ])
          else this.sellReverse.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            "전일 종가 " + String(element.close) + this.unit,
            element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" : "정보 없음",
            element.last_buy_close != -1 ? "  " + " (매수가 " + String(element.last_buy_close) + this.unit + ")" : "",
            String((element.close - element.last_buy_close) / element.last_buy_close * 100)
          ])
        });
        this.getReverseData = true
        break;
      case "triplescreen":
        data.forEach(element => {
          if (element.type === "buy") this.buyTriple.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            "전일 종가 " + String(element.close) + this.unit,
          ])
          else this.sellTriple.push([
            this.dataService.getCompanyNamebyCode(element.code, this.type),
            "전일 종가 " + String(element.close) + this.unit,
            element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" : "정보 없음",
            element.last_buy_close != -1 ? "  " + " (매수가 " + String(element.last_buy_close) + this.unit + ")" : "",
            String((element.close - element.last_buy_close) / element.last_buy_close * 100)
          ])
        });
        this.getTripleScreenData = true
        break;
      default:
        break;
    }
  }
  parseMomentum(data: any) {
    this.momentumData = []
    this.momentumData5 = []

    data.forEach((element, index) => {
      let item: momentumData = {
        code: element.company,
        company: this.dataService.getCompanyNamebyCode(element.company, this.type),
        rate: String(element.returns.toFixed(2)) + "%"
      }
      this.momentumData.push(item)
      if (index < 5) this.momentumData5.push(item)
    });
    this.dataService.setMomentumData(this.momentumData, 90, this.type)
  }

  onTapMomentum() {
    this.router.navigate(['momentum'])
  }
}