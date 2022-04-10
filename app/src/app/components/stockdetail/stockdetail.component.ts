import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { bollingerData, priceData, signalData, TradeViewSettings, tripleScreenData } from './stockdetail.model';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdetailComponent implements OnInit {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  public code: string = ""
  public companyName: string = ""

  public isDefault: boolean = true
  public isBollingerTrendFollowing: boolean = false
  public isBollingerTrendReverse: boolean = false
  public isTripleScreen: boolean = false

  public rawStockData: priceData[] = []
  public rawDataBollinger: bollingerData[] = []
  public rawDataBollingerTrendSignal: signalData[] = []
  public rawDataBollingerReverseSignal: signalData[] = []
  public rawDataTripleScreen: tripleScreenData[] = []
  public rawDataTripleScreenSignal: signalData[] = []

  private stockGraph: any = {}
  private closeGraph: any = {}

  public graphList = [] as any

  public getData: boolean = false
  public getBollingerData: boolean = false
  public getBollingerSignalData: boolean = false
  public getTripleScreenData: boolean = false

  public firstChart = new TradeViewSettings().settings;
  public revision = 1

  constructor(
    private requestService: RequestService,
    private statusService: PagestatusService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public plotlyService: PlotlyService) {
    this.route.queryParams.subscribe((params: any) => {
      this.code = params['code']
      this.companyName = params['companyName']
    });
    this.statusService.setStatus("loading-forward")
    const Plotly = plotlyService.getPlotly();
  }

  ngOnInit(): void {
    console.log("ngOnInit called!")

    this.requestService.getPrices(this.code)
      .subscribe({
        next: (v: any) => {
          this.rawStockData = JSON.parse(Object(v.body))
          console.log(this.rawStockData)

          this.statusService.setStatus("normal")
          this.getData = true

          this.initCommonGraphSettings()
          this.initDefaultGraph()          
          this.dataService.setStockData(this.code, this.rawStockData)

          this.requestService.getBollingerInfo(this.code)
          .subscribe({
            next: (v: any) => {
              this.rawDataBollinger = Object(v.body)
              this.getBollingerData = true
              this.dataService.setBollingerData(this.code, this.rawDataBollinger)
    
              this.requestService.getBollingerReverseSignal(this.code)
              .subscribe({
                next: (v: any) => {
                  this.rawDataBollingerReverseSignal = Object(v.body)
                  this.getBollingerSignalData = true
                  this.dataService.setBollingerReverseSignalData(this.code, this.rawDataBollingerReverseSignal)
                  
                  this.requestService.getBollingerTrendSignal(this.code)
                  .subscribe({
                    next: (v: any) => {
                      this.rawDataBollingerTrendSignal = Object(v.body)
                      this.dataService.setBollingerTrendSignalData(this.code, this.rawDataBollingerTrendSignal)
                    },
                    error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                  });
                },
                error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
              });
            },
            error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
          });

          this.requestService.getTripleScreenSignal(this.code)
          .subscribe({
            next: (v: any) => {
              this.rawDataTripleScreenSignal = Object(v.body)
              this.dataService.setTripleScreenSignalData(this.code, this.rawDataTripleScreenSignal)

              this.requestService.getTripleScreenInfo(this.code)
              .subscribe({
                next: (v: any) => {
                  this.rawDataTripleScreen = Object(v.body)
                  this.getTripleScreenData = true
                  this.dataService.setTripleScreenData(this.code, this.rawDataTripleScreen)
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

  ngAfterViewInit() {
    console.log("ngAfterViewInit called!")
  }

  initCommonGraphSettings() {
    console.log("initCommonGraphSettings called!")

    let startDate = new Date(this.rawStockData[0].date).getTime()
    let endDate = new Date(this.rawStockData[this.rawStockData.length - 1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length - 31].date).getTime()

    this.firstChart.layout.xaxis.range = [defaultstartDate, endDate];
    this.firstChart.layout.xaxis.rangeslider.range = [startDate, endDate];
  }

  initDefaultGraph() {
    console.log("initDefaultGraph called!")

    this.stockGraph = {
      x: [],
      close: [],
      decreasing: { line: { color: "#4E7FEE" } },
      high: [],
      increasing: { line: { color: "#EE4B28" } },
      low: [],
      open: [],
      type: "candlestick",
      xaxis: "x",
      yaxis: "y",
      name: "차트 정보"
    }

    this.closeGraph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "종가 추세선"
    }

    this.rawStockData.forEach(element => {
      this.stockGraph.x.push(new Date(element.date).getTime());
      this.stockGraph.close.push(element.close);
      this.stockGraph.high.push(element.high);
      this.stockGraph.low.push(element.low);
      this.stockGraph.open.push(element.open);

      this.closeGraph.x.push(element.date);
      this.closeGraph.y.push(element.close);
    });

    this.firstChart.data = []
    //graph drawing
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)
    
    let endDate = new Date(this.rawStockData[this.rawStockData.length - 1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length - 31].date).getTime()
    this.firstChart.layout.xaxis.range = [defaultstartDate, endDate];

    let array = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.low; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    this.revision++
  }

  tapBolingerTrend() {
    console.log("Tap BolingerTrend button")
    this.isDefault = false
    this.isBollingerTrendFollowing = true
    this.isBollingerTrendReverse = false
    this.isTripleScreen = false
    // this.router.navigate(['stockdetail-bollingertrend'], {
    //   queryParams: {
    //     code: this.code,
    //     companyName: this.companyName
    //   }
    // })
  }

  tapBollingerReverse() {
    console.log("Tap BolingerReverse button")
    this.isDefault = false
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = true
    this.isTripleScreen = false
    // this.router.navigate(['stockdetail-bollingerreverse'], {
    //   queryParams: {
    //     code: this.code,
    //     companyName: this.companyName
    //   }
    // })
  }

  tapTripleScreen() {
    console.log("Tap TripleScreen button")
    this.isDefault = false
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = true
    //   this.router.navigate(['stockdetail-triplescreen'], {
  //     queryParams: {
  //       code: this.code,
  //       companyName: this.companyName
  //     }
  //   })
  // }
  }

  tapDefault() {
    console.log("Tap Default button")
    this.isDefault = true
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = false
    //   this.router.navigate(['stockdetail-triplescreen'], {
  //     queryParams: {
  //       code: this.code,
  //       companyName: this.companyName
  //     }
  //   })
  // }
  }
}
