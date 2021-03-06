import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { bollingerData, priceData, signalData, TradeViewSettings, tripleScreenData } from './stockdetail.model';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { DataService } from 'src/app/services/data.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdetailComponent implements OnInit {
  @ViewChild('group') group;
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  @HostListener('touchstart', ['$event']) onTouchStart(event) {
    (<HTMLElement>this.eRef.nativeElement).querySelectorAll('.nsewdrag').forEach(element => {
    if(element.contains(event.target)) {
      this.blockSwipe = true
    }
  });
}
@HostListener('touchend', ['$event']) onSwipeEnd(event) {
  (<HTMLElement>this.eRef.nativeElement).querySelectorAll('.nsewdrag').forEach(element => {
    if(element.contains(event.target)) {
      this.blockSwipe = true
    } 
  });
}

  public code: string = ""
  public companyName: string = ""

  public isDefault: boolean = false
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

  public getData: boolean = false

  public firstChart = new TradeViewSettings().settings;
  public revision = 1

  public selectedIndex = 0
  private itemLen = 4
  public type: string
  private subscription : Subscription;
  public blockSwipe: boolean = false
  private chartElmList:any[] = []

  constructor(
    private requestService: RequestService,
    private statusService: PagestatusService,
    private dataService: DataService,
    private route: ActivatedRoute,
    public plotlyService: PlotlyService,
    private eRef: ElementRef,) {
    this.route.queryParams.subscribe((params: any) => {
      this.code = params['code']
      this.companyName = params['companyName']
    });
    this.statusService.setStatus("loading-forward")
    const Plotly = plotlyService.getPlotly();
  }

  // this.statusService.getType().subscribe((value) => {
  //   console.log("TYPE ::" + value);
  //   this.type = value

  //   this.resetAllData()

  //   this.companyInfo = this.dataService.getCompanyData(this.type)
  //   console.log(this.companyInfo)
  //   if (this.companyInfo === undefined) {
  //     this.requestCompanyData(this.type)
  //   } else {
  //     this.requestSignalData(this.type)
  //   }
  // });

  ngOnInit(): void {
    console.log("ngOnInit called!")

    this.subscription = this.statusService.getType().subscribe((value) => {
    console.log("TYPE ::" + value);
    this.type = value

    this.requestData()
  });
  }
  
  ngOnDestroy(): void {
    console.log("ngOnDestroy")
    this.subscription.unsubscribe()
  }

  requestData() {
    this.requestService.getPrices(this.code, this.type)
    .subscribe({
      next: (v: any) => {
        this.rawStockData = JSON.parse(Object(v.body))
        console.log(this.rawStockData)

        this.statusService.setStatus("normal")

        this.initCommonGraphSettings()
        this.initDefaultGraph()
        this.dataService.setStockData(this.code, this.rawStockData)

        this.requestService.getBollingerInfo(this.code, this.type)
          .subscribe({
            next: (v: any) => {
              this.rawDataBollinger = Object(v.body)
              this.dataService.setBollingerData(this.code, this.rawDataBollinger)

              this.requestService.getBollingerReverseSignal(this.code, this.type)
                .subscribe({
                  next: (v: any) => {
                    this.rawDataBollingerReverseSignal = Object(v.body)
                    this.dataService.setBollingerReverseSignalData(this.code, this.rawDataBollingerReverseSignal)

                    this.requestService.getBollingerTrendSignal(this.code, this.type)
                      .subscribe({
                        next: (v: any) => {
                          this.rawDataBollingerTrendSignal = Object(v.body)
                          this.dataService.setBollingerTrendSignalData(this.code, this.rawDataBollingerTrendSignal)

                          this.isDefault = true
                        },
                        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                      });
                  },
                  error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                });
            },
            error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
          });

        // this.requestService.getTripleScreenSignal(this.code, this.type)
        //   .subscribe({
        //     next: (v: any) => {
        //       this.rawDataTripleScreenSignal = Object(v.body)
        //       this.dataService.setTripleScreenSignalData(this.code, this.rawDataTripleScreenSignal)

        //       this.requestService.getTripleScreenInfo(this.code, this.type)
        //         .subscribe({
        //           next: (v: any) => {
        //             this.rawDataTripleScreen = Object(v.body)
        //             this.dataService.setTripleScreenData(this.code, this.rawDataTripleScreen)
        //           },
        //           error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
        //         });
        //     },
        //     error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
        //   });

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
      name: "?????? ??????"
    }

    this.closeGraph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "?????? ?????????"
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
  }

  tapBollingerReverse() {
    console.log("Tap BolingerReverse button")
    this.isDefault = false
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = true
    this.isTripleScreen = false
  }

  tapTripleScreen() {
    console.log("Tap TripleScreen button")
    this.isDefault = false
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = true
  }

  tapDefault() {
    console.log("Tap Default button")
    this.isDefault = true
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = false
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
    switch (this.selectedIndex) {
      case 0: this.tapDefault()
        break;
      case 1: this.tapBolingerTrend()
        break;
      case 2: this.tapBollingerReverse()
        break;
      case 3: this.tapTripleScreen()
        break;
    }
  }

  onSwipeRight() {
    console.log("SWIPE RIGHT")
    if(!IS_MOBILE) return
    if(this.blockSwipe) {this.blockSwipe = false; return}
    if(this.selectedIndex !== 0) {this.selectedIndex = this.selectedIndex - 1;this.group.focusTab(this.selectedIndex )}
 
  }
  onSwipeLeft() {    
    console.log("SWIPE LEFT")
    if(!IS_MOBILE) return
    if(this.blockSwipe) {this.blockSwipe = false; return}
    if(this.selectedIndex !== this.itemLen-1) {this.selectedIndex = this.selectedIndex + 1
    this.group.focusTab(this.selectedIndex )
    }
  }
}
