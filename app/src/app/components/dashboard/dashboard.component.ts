import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { signalData } from '../stockdetail/stockdetail.model';
import { MatDialog } from '@angular/material/dialog';
import { ListComponent } from 'src/app/modules/list/list.component';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-menu',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  public getTrendData: boolean = false
  public getReverseData: boolean = false
  public getTripleScreenData: boolean = false
  public status = "loading-forward";

  public rawLatestSignalTrend: signalData[] = []
  public rawLatestSignalReverse: signalData[] = []
  public rawLatestSignalTripleScreen: signalData[] = []

  public buyTrend: Array<string[]> = []
  public buyReverse: Array<string[]> = []
  public buyTriple: Array<string[]> = []
  public sellTrend: Array<string[]> = []
  public sellReverse: Array<string[]> = []
  public sellTriple: Array<string[]> = []

  constructor(private statusService: PagestatusService,
    private router: Router,
    private requestService: RequestService,
    private dataService: DataService,
    public dialog: MatDialog) {
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.statusService.setStatus("normal")
    }, 1000);

    this.requestService.getLatestBollingerTrendSignal()
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalTrend = Object(v.body)
          console.log(this.rawLatestSignalTrend)
          this.parseSignalData(this.rawLatestSignalTrend, "bollinger-trend")
        },
        error: (e: any) => { }
      });

    this.requestService.getLatestBollingerReverseSignal()
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalReverse = Object(v.body)
          this.parseSignalData(this.rawLatestSignalReverse, "bollinger-reverse")

        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

    this.requestService.getLatestTripleScreenSignal()
      .subscribe({
        next: (v: any) => {
          this.rawLatestSignalTripleScreen = Object(v.body)
          this.parseSignalData(this.rawLatestSignalTripleScreen, "triplescreen")

        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  openDialog(type: string) {
    let dataArray: Array<string[]> = []
    let title = ""
    let columnlist = IS_MOBILE ? ["종목", "신호가", "과거 거래가", "수익률"]:["종목",  "신호일", "신호가","과거 거래일", "과거 거래가", "수익률"]
    
    switch (type) {
      case "buyTrend":
        this.rawLatestSignalTrend.forEach(element => {
          title = "볼린저 추세 추동 매수 신호"
          if(element.type === "buy" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_sell_date,
              String(element.last_sell_close),
              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_sell_close),
              "-",
              element.code
            ])
          }
        });
        break;
      case "buyReverse":
        title = "볼린저 반전 매매 매수 신호"
        this.rawLatestSignalReverse.forEach(element => {
          if(element.type === "buy" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_sell_date,
              String(element.last_sell_close),
              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_sell_close),
              "-",
              element.code
            ])
          }
        });
        break;
      case "buyTriple":
        title = "삼중창 매수 신호"

        this.rawLatestSignalTripleScreen.forEach(element => {
          if(element.type === "buy" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_sell_date,
              String(element.last_sell_close),
              "-",
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_sell_close),
              "-",
              element.code
            ])
          }
        });
        break;
      case "sellTrend":
        title = "볼린저 추세 추동 매도 신호"

        this.rawLatestSignalTrend.forEach(element => {
          if(element.type === "sell" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_buy_date,
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
          }
        });
        break;
      case "sellReverse":
        title = "볼린저 반전 매매 매도 신호"

        this.rawLatestSignalReverse.forEach(element => {
          if(element.type === "sell" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_buy_date,
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
          }
        });
        break;
      case "sellTriple":
        title = "볼린저 추세 추동 매도 신호"

        this.rawLatestSignalTripleScreen.forEach(element => {
          if(element.type === "sell" && element.valid === "valid"){
            if(!IS_MOBILE) dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              element.date,
              String(element.close),
              element.last_buy_date,
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
            else dataArray.push([
              this.dataService.getCompanyNamebyCode(element.code),
              String(element.close),
              String(element.last_buy_close),
              String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)),
              element.code
            ])
          }
        });
        break;

      default:
        break
    }

    this.dialog.open(ListComponent, {
      width:'80vw',
      height:'80vh',
      data: {
        title: title,
        column: columnlist,
        data: dataArray
      },
    });
  }

  parseSignalData(data: signalData[], type: string) {
    switch (type) {
      case "bollinger-trend":
        data.forEach(element => {
          if (element.type === "buy") this.buyTrend.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
          ])
          else this.sellTrend.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
            element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" + "  " + "(매수가 " + String(element.last_buy_close) + "원)" : "정보 없음"
          ])
        });
        this.getTrendData = true
        break;
      case "bollinger-reverse":
        data.forEach(element => {
          if (element.type === "buy") this.buyReverse.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
          ])
          else this.sellReverse.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
            element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" + "  " + "(매수가 " + String(element.last_buy_close) + "원)" : "정보 없음"
          ])
        });
        this.getReverseData = true
        break;
      case "triplescreen":
        data.forEach(element => {
          if (element.type === "buy") this.buyTriple.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
          ])
          else this.sellTriple.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
            element.last_buy_close != -1 ? String(((element.close - element.last_buy_close) / element.last_buy_close * 100).toFixed(2)) + "% 수익" + "  " + "(매수가 " + String(element.last_buy_close) + "원)" : "정보 없음"
          ])
        });
        this.getTripleScreenData = true
        break;
      default:
        break;
    }
  }
}