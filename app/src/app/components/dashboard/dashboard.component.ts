import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { signalData } from '../stockdetail/stockdetail.model';

@Component({
  selector: 'app-menu',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(IgxNavigationDrawerComponent, { static: true })
  public drawer: IgxNavigationDrawerComponent;

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
    private dataService: DataService) {
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
        error: (e: any) => {
          //     this.rawLatestSignalTrend = [{code: '001780', date: '2022-04-11', type: 'sell', close: 3755, valid: 'valid'},
          //   {code: '004370', date: '2022-04-11', type: 'buy', close: 319500, valid: 'valid'},
          //  {code: '007210', date: '2022-04-11', type: 'sell', close: 3475, valid: 'valid'},
          //  {code: '007820', date: '2022-04-11', type: 'sell', close: 6640, valid: 'valid'},
          //   {code: '008250', date: '2022-04-11', type: 'sell', close: 11900, valid: 'valid'},
          //  {code: '013700', date: '2022-04-11', type: 'sell', close: 2395, valid: 'valid'},
          //  {code: '015890', date: '2022-04-11', type: 'buy', close: 7210, valid: 'valid'},
          //  {code: '025550', date: '2022-04-11', type: 'sell', close: 6180, valid: 'valid'},
          //  {code: '026150', date: '2022-04-11', type: 'sell', close: 11350, valid: 'valid'},
          //  {code: '028050', date: '2022-04-11', type: 'sell', close: 24350, valid: 'valid'},
          //  {code: '029780', date: '2022-04-11', type: 'buy', close: 33050, valid: 'valid'},
          //  {code: '035890', date: '2022-04-11', type: 'sell', close: 1815, valid: 'valid'},
          //   {code: '036010', date: '2022-04-11', type: 'buy', close: 11650, valid: 'valid'},
          //   {code: '036090', date: '2022-04-11', type: 'sell', close: 1295, valid: 'valid'},
          //   {code: '038010', date: '2022-04-11', type: 'sell', close: 5850, valid: 'valid'},
          //  {code: '040910', date: '2022-04-11', type: 'sell', close: 10400, valid: 'valid'},
          //  {code: '043340', date: '2022-04-11', type: 'buy', close: 1290, valid: 'valid'},
          //  {code: '043360', date: '2022-04-11', type: 'buy', close: 3830, valid: 'valid'},
          //  {code: '046210', date: '2022-04-11', type: 'buy', close: 3920, valid: 'valid'},
          //   {code: '046940', date: '2022-04-11', type: 'sell', close: 5340, valid: 'valid'},
          //   {code: '047560', date: '2022-04-11', type: 'sell', close: 13800, valid: 'valid'},
          //   {code: '054040', date: '2022-04-11', type: 'sell', close: 4715, valid: 'valid'},
          //   {code: '058110', date: '2022-04-11', type: 'sell', close: 7280, valid: 'valid'},
          //   {code: '066430', date: '2022-04-11', type: 'buy', close: 3235, valid: 'valid'},
          //   {code: '082210', date: '2022-04-11', type: 'buy', close: 7210, valid: 'valid'},
          //  {code: '084650', date: '2022-04-11', type: 'sell', close: 9540, valid: 'valid'},
          //  {code: '085670', date: '2022-04-11', type: 'buy', close: 6260, valid: 'valid'},
          //  {code: '089600', date: '2022-04-11', type: 'sell', close: 28050, valid: 'valid'},
          //   {code: '101170', date: '2022-04-11', type: 'sell', close: 4825, valid: 'valid'},
          //  {code: '102120', date: '2022-04-11', type: 'buy', close: 13550, valid: 'valid'},
          //  {code: '105330', date: '2022-04-11', type: 'sell', close: 10850, valid: 'valid'},
          //  {code: '107590', date: '2022-04-11', type: 'buy', close: 147500, valid: 'valid'},
          //   {code: '117730', date: '2022-04-11', type: 'sell', close: 8660, valid: 'valid'},
          //   {code: '121800', date: '2022-04-11', type: 'sell', close: 16850, valid: 'valid'}
          //   ]
          //   this.getTrendData = true
        }
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

  parseSignalData(data: signalData[], type: string) {
    switch (type) {
      case "bollinger-trend":
        data.forEach(element => {
          if (element.type === "buy") this.buyTrend.push([
            this.dataService.getCompanyNamebyCode(element.code),
            "전일 종가 " + String(element.close) + "원",
            // String(element.last_sell_date),
            // " 당시 매도 가격 " + String(element.last_sell_close) + "원"
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
            // String(element.last_sell_date),
            // " 당시 매도 가격 " + String(element.last_sell_close) + "원"
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
            // String(element.last_sell_date),
            // " 당시 매도 가격 " + String(element.last_sell_close) + "원"
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