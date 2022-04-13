import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { TradeViewSettings, priceData, bollingerData, signalData, tripleScreenData } from '../stockdetail/stockdetail.model';
import { DataService } from 'src/app/services/data.service';
const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-stockdstail-triplescreen',
  templateUrl: './stockdstail-triplescreen.component.html',
  styleUrls: ['./stockdstail-triplescreen.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdstailTriplescreenComponent implements OnInit, OnDestroy {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  
  public code: string = ""
  public companyName: string = ""

  public rawStockData: priceData[] = []
  public rawDataTripleScreen: tripleScreenData[] = []
  public rawDataTripleScreenSignal: signalData[] = []

  private stockGraph: any = {}
  private closeGraph: any = {}
  
  private EMA130Graph: any = {}
  private MACDGraph: any = {}
  private MACDSignalGraph: any = {}
  private MACDHistGraph: any = {}
  private FASTKGraph: any = {}
  private SLOWDGraph: any = {}

  private buyMarker: any = {}
  private sellMarker: any = {}
  private buyLine = [] as any
  private sellLine = [] as any
  public graphList = [] as any

  public getData: boolean = false
  
  public firstChart = new TradeViewSettings().settings;
  public secondChart = new TradeViewSettings().settings;
  public thirdChart = new TradeViewSettings().settings;

  public revision = 1

  constructor(
    private route: ActivatedRoute,
    public plotlyService: PlotlyService,
    private router: Router,
    private dataService: DataService) {

    this.route.queryParams.subscribe((params: any) => {
      this.code = params['code']
      this.companyName = params['companyName']
    });
    const Plotly = plotlyService.getPlotly();
  }

  ngOnInit(): void {
    console.log("ngOnInit called!")

    this.rawDataTripleScreen = this.dataService.getTripleScreenData(this.code)
    this.rawStockData = this.dataService.getStockData(this.code)
    this.rawDataTripleScreenSignal = this.dataService.getTripleScreenSignalData(this.code)

    this.initCommonGraphSettings()
    this.initDefaultGraph()
    this.initTripleScreenGraph()
    this.initTripleScreenSignalGraph()

    this.getData = true
  }

  ngOnDestroy() {
    console.log("Destroy triple screen")

    this.firstChart.data = []
    this.secondChart.data = []
    this.thirdChart.data = []
  }

  relayoutChart(event: any) {
    console.log("relayoutChart called!")
    if(event['xaxis.range[0]'] == undefined) return 
    if(event['xaxis.range[1]'] == undefined) return 

    let parseStart = event['xaxis.range[0]'].replace('-', '/').replace('-', '/').substr(0, 19)
    let parseEnd = event['xaxis.range[1]'].replace('-', '/').replace('-', '/').substr(0, 19)

    let startdate = new Date(parseStart).getTime()
    let enddate = new Date(parseEnd).getTime()

    this.firstChart.layout.xaxis.range = [startdate, enddate];
    this.secondChart.layout.xaxis.range = [startdate, enddate];
    this.thirdChart.layout.xaxis.range = [startdate, enddate];
    
    this.revision++ 
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

    this.secondChart.layout.xaxis.range = [defaultstartDate, endDate];
    this.secondChart.layout.xaxis.rangeslider.range = [startDate, endDate];

    this.thirdChart.layout.xaxis.range = [defaultstartDate, endDate];
    this.thirdChart.layout.xaxis.rangeslider.range = [startDate, endDate];
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

  }

  initTripleScreenGraph() {
    console.log("initBollingerGraph called!")

    this.EMA130Graph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "EMA130"
    }

    this.MACDGraph = {
      x: [],
      y: [],
      line: { color: "rgba(243, 89, 125, 1))" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "MACD"
    }

    this.MACDSignalGraph = {
      x: [],
      y: [],
      line: { color: "rgba(148, 77, 233, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "MACD-Signal"
    }

    this.MACDHistGraph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "MACD-Hist"
    }
    this.FASTKGraph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%K",
      showlegend: true
    }
    this.SLOWDGraph = {
      x: [],
      y: [],
      line: { color: "rgba(243, 89, 125, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%D"
    }

    this.rawDataTripleScreen.forEach(element => {
      this.EMA130Graph.x.push(new Date(element.date).getTime());
      this.EMA130Graph.y.push(element.ema130)

      this.MACDGraph.x.push(new Date(element.date).getTime());
      this.MACDGraph.y.push(element.macd);

      this.MACDHistGraph.x.push(new Date(element.date).getTime());
      this.MACDHistGraph.y.push(element.macdhist);

      this.MACDSignalGraph.x.push(new Date(element.date).getTime());
      this.MACDSignalGraph.y.push(element._signal);

      this.SLOWDGraph.x.push(new Date(element.date).getTime());
      this.SLOWDGraph.y.push(element.slow_d);

      this.FASTKGraph.x.push(new Date(element.date).getTime());
      this.FASTKGraph.y.push(element.fast_k);
    });


    if(!IS_MOBILE) this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.EMA130Graph)

    let stockarray = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxstockY = Math.max.apply(Math, stockarray.map(function (o) { return o.high; }))
    let minstockY = Math.min.apply(Math, stockarray.map(function (o) { return o.low; }))

     let array = this.rawDataTripleScreen.slice(this.rawDataTripleScreen.length - 31, this.rawDataTripleScreen.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.ema130; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.ema130; }))

    
    let realMin = Math.min(minY, minstockY)
    let realMax = Math.max(maxY, maxstockY)

    this.firstChart.layout.yaxis.range = [realMin, realMax];

    this.secondChart.data.push(this.MACDGraph)
    this.secondChart.data.push(this.MACDHistGraph)
    this.secondChart.data.push(this.MACDSignalGraph)
    let maxY2 = Math.max.apply(Math, array.map(function (o) { return Math.max(Math.max(o.macd, o.macdhist), o._signal) }))
    let minY2 = Math.min.apply(Math, array.map(function (o) { return Math.max(Math.min(o.macd, o.macdhist), o._signal) }))
    this.secondChart.layout.yaxis.range = [minY2, maxY2];
    this.secondChart.layout.yaxis.title = ""

    this.thirdChart.data.push(this.FASTKGraph)
    this.thirdChart.data.push(this.SLOWDGraph)
    let maxY3 = Math.max.apply(Math, array.map(function (o) { return Math.max(o.fast_k, o.slow_d) }))
    let minY3 = Math.min.apply(Math, array.map(function (o) { return Math.min(o.fast_k, o.slow_d) }))
    this.thirdChart.layout.yaxis.range = [minY3, maxY3];
    this.thirdChart.layout.yaxis.title = ""

    this.buyLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });

    this.sellLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });

  }

  initTripleScreenSignalGraph() {
    console.log("initBollingerSignalGraph called!")

    this.buyMarker = {
      x: [],
      y: [],
      type: "scatter",
      mode: 'markers',
      xaxis: "x",
      yaxis: "y",
      marker: {
        color: '#EE4B28',
        size: 10
      }, showlegend: true
      ,
      name: "추세 추종 매수 포인트"
    }

    this.sellMarker = {
      x: [],
      y: [],
      type: "scatter",
      xaxis: "x",
      yaxis: "y",
      mode: 'markers',
      marker: {
        color: '#4E7FEE',
        size: 10
      },
      showlegend: true
      ,
      name: "추세 추종 매도 포인트"
    }

    this.rawDataTripleScreenSignal.forEach((element, index) => {
      var date: number = Number(new Date(element.date).getTime())
      var isValid: boolean = false

      if(index > 0 && this.rawDataTripleScreenSignal[index-1].type !== element.type) {
        isValid = true
      }
      if (element.type === 'buy') {
        this.buyMarker.x.push(new Date(element.date).getTime())
        if(isValid) this.buyLine.push(this.createLineElem(new Date(element.date).getTime(), '#EE4B28'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.buyMarker.y.push(item.close)
        });
      } else if (element.type === 'sell') {
        this.sellMarker.x.push(new Date(element.date).getTime())
        if(isValid) this.sellLine.push(this.createLineElem(new Date(element.date).getTime(), '#4E7FEE'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.sellMarker.y.push(item.close)
        });
      }
    });

    this.buyLine.forEach((element: any) => {
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
      this.firstChart.layout.shapes.push(element)
    });

    this.sellLine.forEach((element: any) => {
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
      this.firstChart.layout.shapes.push(element)
    });
  }

  createLineElem(x: any, color: string): any {

    var line = {
      x0: 0,
      y0: -10000000,
      x1: 0,
      y1: 10000000,
      type: "line",
      line: {
        color: color,
        width: 2
      }
    }

    line.x0 = x
    line.x1 = x

    line.line.color = color

    return line
  }
}
