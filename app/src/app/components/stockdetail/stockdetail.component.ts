import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { TradeViewSettings } from './stockdetail.model';
import { PagestatusService } from 'src/app/services/pagestatus.service';

export interface priceData {
  code: string,
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  diff: number,
  volume: number
}

export interface signalData {
  code: string,
  date: string,
  type: string
}

export interface bollingerData {
  code: string,
  date: string,
  ma20: number,
  stddev: number,
  upper: number,
  lower: number,
  pb: number,
  bandwidth: number,
  mfi10: number,
  iip21: number
}

export interface tripleScreenData {
  code: string,
  date: string,
  ema130: number,
  ema60: number,
  macd: number,
  _signal: number,
  macdhist: number,
  fast_k: number,
  slow_d: number
}
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
  private bollingerUpperGraph: any = {}
  private bollingerLowerGraph: any = {}
  private M20Graph: any = {}
  private PBGraph: any = {}
  private PB100Graph: any = {}
  private MFI10Graph: any = {}
  private IIP21Graph: any = {}
  private EMA130Graph: any = {}
  private MACDGraph: any = {}
  private MACDSignalGraph: any = {}
  private MACDHistGraph: any = {}
  private FASTKGraph: any = {}
  private SLOWDGraph: any = {}

  private buyTrendMarker: any = {}
  private sellTrendMarker: any = {}
  private buyReverseMarker: any = {}
  private sellReverseMarker: any = {}
  private buyTrendLine = [] as any
  private sellTrendLine = [] as any
  private buyReverseLine = [] as any
  private sellReverseLine = [] as any
  private buyTripleScreenMarker: any = {}
  private sellTripleScreenMarker: any = {}
  private buyTripleScreenLine = [] as any
  private sellTripleScreenLine = [] as any
  public graphList = [] as any

  public getData: boolean = false
  public getBollingerData: boolean = false
  public getBollingerSignalData: boolean = false
  public getTripleScreenData: boolean = false

  public firstChart = new TradeViewSettings().settings;
  public secondChart = new TradeViewSettings().settings;
  public thirdChart = new TradeViewSettings().settings;
  public revision = 1

  private rangeFirstY = [1, 1]
  private rangeSecondY = [1, 1]
  private rangeThirdY = [1, 1]

  constructor(
    private requestService: RequestService,
    private statusService: PagestatusService,
    private route: ActivatedRoute,
    public plotlyService: PlotlyService) {
    this.route.queryParams.subscribe((params: any) => {
      this.code = params['code']
      this.companyName = params['companyName']
    });
    this.statusService.setStatus("loading-forward")
    const Plotly = plotlyService.getPlotly();
  }

  ngOnInit(): void {
    this.requestService.getPrices(this.code)
      .subscribe({
        next: (v: any) => {
          this.rawStockData = JSON.parse(Object(v.body))
          console.log(this.rawStockData)

          this.statusService.setStatus("normal")
          this.getData = true

          this.initCommonGraphSettings()
          this.initDefaultGraph()

          this.requestService.getBollingerTrendSignal(this.code)
            .subscribe({
              next: (v: any) => {
                this.rawDataBollingerTrendSignal = Object(v.body)

                this.requestService.getBollingerReverseSignal(this.code)
                  .subscribe({
                    next: (v: any) => {
                      this.rawDataBollingerReverseSignal = Object(v.body)
                      this.getBollingerSignalData = true
                      this.initBollingerSignalGraph()
                    },
                    error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
                  });
              },
              error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
            });
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

    this.requestService.getBollingerInfo(this.code)
      .subscribe({
        next: (v: any) => {
          this.rawDataBollinger = Object(v.body)
          this.getBollingerData = true

          this.initBollingerGraph()
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

    this.requestService.getTripleScreenInfo(this.code)
      .subscribe({
        next: (v: any) => {
          this.rawDataTripleScreen= Object(v.body)
          this.getTripleScreenData = true

          this.initTripleScreenGraph()

          this.requestService.getTripleScreenSignal(this.code)
            .subscribe({
              next: (v: any) => {
                this.rawDataTripleScreenSignal = Object(v.body)

                this.initTripleScreenSignalGraph()
              },
              error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
            });
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  relayoutfirstchart(event: any) {
    let parseStart = event['xaxis.range[0]'].replace('-', '/').replace('-', '/').substr(0, 19)
    let parseEnd = event['xaxis.range[1]'].replace('-', '/').replace('-', '/').substr(0, 19)

    let startdate = new Date(parseStart).getTime()
    let enddate = new Date(parseEnd).getTime()

    this.secondChart.layout.xaxis.range = [startdate, enddate];
    this.thirdChart.layout.xaxis.range = [startdate, enddate];
    this.revision++
  }

  relayoutsecondchart(event: any) {
    let parseStart = event['xaxis.range[0]'].replace('-', '/').replace('-', '/').substr(0, 19)
    let parseEnd = event['xaxis.range[1]'].replace('-', '/').replace('-', '/').substr(0, 19)

    let startdate = new Date(parseStart).getTime()
    let enddate = new Date(parseEnd).getTime()

    this.firstChart.layout.xaxis.range = [startdate, enddate];
    this.thirdChart.layout.xaxis.range = [startdate, enddate];
    this.revision++
  }

  relayoutthirdchart(event: any) {
    let parseStart = event['xaxis.range[0]'].replace('-', '/').replace('-', '/').substr(0, 19)
    let parseEnd = event['xaxis.range[1]'].replace('-', '/').replace('-', '/').substr(0, 19)

    let startdate = new Date(parseStart).getTime()
    let enddate = new Date(parseEnd).getTime()

    this.firstChart.layout.xaxis.range = [startdate, enddate];
    this.secondChart.layout.xaxis.range = [startdate, enddate];
    this.revision++
  }

  ngAfterViewInit() {
  }

  initCommonGraphSettings() {
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
    this.tapDefault()
  }

  initBollingerGraph() {
    this.M20Graph = {
      x: [],
      y: [],
      line: { color: "rgba(255, 255, 125, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "20일 Moving average"
    }

    this.bollingerUpperGraph = {
      x: [],
      y: [],
      line: { color: "rgba(148, 77, 233, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "Bollinger Band"
    }

    this.bollingerLowerGraph = {
      x: [],
      y: [],
      line: { color: "rgba(148, 77, 233, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      showlegend: false
    }

    this.PB100Graph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%b * 100"
    }
    this.PBGraph = {
      x: [],
      y: [],
      line: { color: "white" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%b",
      showlegend: true
    }
    this.MFI10Graph = {
      x: [],
      y: [],
      line: { color: "rgba(243, 89, 125, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "10일 Money flow"
    }

    this.IIP21Graph = {
      x: [],
      y: [],
      marker: {
        color: 'white'
      },
      type: 'bar',
      xaxis: "x",
      yaxis: "y",
      name: "21일 일중 강도",
      showlegend: true
    }

    this.rawDataBollinger.forEach(element => {
      this.M20Graph.x.push(new Date(element.date).getTime());
      this.M20Graph.y.push(element.ma20)

      this.bollingerUpperGraph.x.push(new Date(element.date).getTime());
      this.bollingerUpperGraph.y.push(element.upper);

      this.bollingerLowerGraph.x.push(new Date(element.date).getTime());
      this.bollingerLowerGraph.y.push(element.lower);

      this.PB100Graph.x.push(new Date(element.date).getTime());
      this.PB100Graph.y.push(element.pb * 100);

      this.PBGraph.x.push(new Date(element.date).getTime());
      this.PBGraph.y.push(element.pb);

      this.MFI10Graph.x.push(new Date(element.date).getTime());
      this.MFI10Graph.y.push(element.mfi10);

      this.IIP21Graph.x.push(new Date(element.date).getTime());
      this.IIP21Graph.y.push(element.iip21);
    });
  }

  initBollingerSignalGraph() {
    this.buyTrendMarker = {
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

    this.sellTrendMarker = {
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

    this.buyReverseMarker = {
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
      name: "반전매매 매수 포인트"
    }

    this.sellReverseMarker = {
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
      name: "반전매매 추종 매도 포인트"
    }

    this.rawDataBollingerTrendSignal.forEach(element => {
      var date: number = Number(new Date(element.date).getTime())

      if (element.type === 'buy') {
        this.buyTrendMarker.x.push(new Date(element.date).getTime())
        this.buyTrendLine.push(this.createLineElem(new Date(element.date).getTime(), '#EE4B28'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.buyTrendMarker.y.push(item.close)
        });
      } else if (element.type === 'sell') {
        this.sellTrendMarker.x.push(new Date(element.date).getTime())
        this.sellTrendLine.push(this.createLineElem(new Date(element.date).getTime(), '#4E7FEE'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.sellTrendMarker.y.push(item.close)
        });
      }
    });

    this.rawDataBollingerReverseSignal.forEach(element => {
      var date: number = Number(new Date(element.date).getTime())

      if (element.type === 'buy') {
        this.buyReverseMarker.x.push(new Date(element.date).getTime())
        this.buyReverseLine.push(this.createLineElem(new Date(element.date).getTime(), '#EE4B28'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.buyReverseMarker.y.push(item.close)
        });
      } else if (element.type === 'sell') {
        this.sellReverseMarker.x.push(new Date(element.date).getTime())
        this.sellReverseLine.push(this.createLineElem(new Date(element.date).getTime(), '#4E7FEE'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.sellReverseMarker.y.push(item.close)
        });
      }
    });
  }
  
  initTripleScreenGraph() {
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
  }

  initTripleScreenSignalGraph() {
    this.buyTripleScreenMarker = {
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
      name: "삼중창 매수 포인트"
    }

    this.sellTripleScreenMarker = {
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
      name: "삼중창 매도 포인트"
    }

    this.rawDataTripleScreenSignal.forEach(element => {
      var date: number = Number(new Date(element.date).getTime())

      if (element.type === 'buy') {
        this.buyTripleScreenMarker.x.push(new Date(element.date).getTime())
        this.buyTripleScreenLine.push(this.createLineElem(new Date(element.date).getTime(), '#EE4B28'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.buyTripleScreenMarker.y.push(item.close)
        });
      } else if (element.type === 'sell') {
        this.sellTripleScreenMarker.x.push(new Date(element.date).getTime())
        this.sellTripleScreenLine.push(this.createLineElem(new Date(element.date).getTime(), '#4E7FEE'))

        this.rawStockData.forEach(item => {
          if (date === Number(item.date)) this.sellTripleScreenMarker.y.push(item.close)
        });
      }
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

  tapDefault() {
    console.log("Tap default button ::  " + this.revision)

    this.stockGraph.showlegend = true
    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)

    this.isDefault = true
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = false

    this.firstChart.layout.shapes = []
    this.secondChart.layout.shapes = []
    this.thirdChart.layout.shapes = []
    console.log(this.firstChart)

    let array = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.low; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    this.rangeFirstY = [minY, maxY]

    this.revision++
    console.log("Tap default button2 ::  " + this.revision)
  }

  tapBolingerTrend() {
    console.log("Tap BolingerTrend button")

    this.isBollingerTrendFollowing = true
    this.isDefault = false
    this.isBollingerTrendReverse = false
    this.stockGraph.showlegend = true
    this.isTripleScreen = false


    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)
    this.firstChart.data.push(this.buyTrendMarker)
    this.firstChart.data.push(this.sellTrendMarker)

    this.secondChart.data = []
    this.secondChart.data.push(this.closeGraph)
    this.secondChart.data.push(this.bollingerLowerGraph)
    this.secondChart.data.push(this.bollingerUpperGraph)
    this.secondChart.data.push(this.M20Graph)

    this.thirdChart.data = []
    this.thirdChart.data.push(this.PB100Graph)
    this.thirdChart.data.push(this.MFI10Graph)
    this.thirdChart.layout.yaxis.title = ""

    this.firstChart.layout.shapes = []
    this.secondChart.layout.shapes = []
    this.thirdChart.layout.shapes = []
    this.buyTrendLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });
    this.sellTrendLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });


    let array = this.rawDataBollinger.slice(this.rawDataBollinger.length - 31, this.rawDataBollinger.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.upper; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.lower; }))
    this.secondChart.layout.yaxis.range = [minY, maxY];
    this.rangeSecondY = [minY, maxY]

    let maxY2 = Math.max.apply(Math, array.map(function (o) { return Math.max(o.pb * 100, o.mfi10); }))
    let minY2 = Math.min.apply(Math, array.map(function (o) { return Math.min(o.pb * 100, o.mfi10); }))
    this.thirdChart.layout.yaxis.range = [minY2, maxY2];
    this.rangeThirdY = [minY2, maxY2]

    this.revision++
  }

  tapBollingerReverse() {
    console.log("Tap BolingerReverse button")

    this.isBollingerTrendFollowing = false
    this.isDefault = false
    this.isBollingerTrendReverse = true
    this.isTripleScreen = false

    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.bollingerLowerGraph)
    this.firstChart.data.push(this.bollingerUpperGraph)
    this.firstChart.data.push(this.closeGraph)
    this.firstChart.data.push(this.M20Graph)
    this.firstChart.data.push(this.buyReverseMarker)
    this.firstChart.data.push(this.sellReverseMarker)

    this.stockGraph.showlegend = false
    this.buyReverseMarker.showlegend = false
    this.sellReverseMarker.showlegend = false

    this.secondChart.data = []
    this.secondChart.data.push(this.PBGraph)
    this.secondChart.layout.yaxis.title = ""

    this.thirdChart.data = []
    this.thirdChart.data.push(this.IIP21Graph)
    this.thirdChart.layout.yaxis.title = ""


    this.firstChart.layout.shapes = []
    this.secondChart.layout.shapes = []
    this.thirdChart.layout.shapes = []
    this.buyReverseLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });
    this.sellReverseLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });


    let array = this.rawDataBollinger.slice(this.rawDataBollinger.length - 31, this.rawDataBollinger.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.upper; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.lower; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];
    this.rangeFirstY = [minY, maxY]

    let maxY2 = Math.max.apply(Math, array.map(function (o) { return o.pb; }))
    let minY2 = Math.min.apply(Math, array.map(function (o) { return o.pb; }))
    this.secondChart.layout.yaxis.range = [minY2, maxY2];
    this.rangeSecondY = [minY2, maxY2]

    let maxY3 = Math.max.apply(Math, array.map(function (o) { return o.iip21; }))
    let minY3 = Math.min.apply(Math, array.map(function (o) { return o.iip21; }))
    this.thirdChart.layout.yaxis.range = [minY3, maxY3];
    this.rangeThirdY = [minY3, maxY3]

    this.revision++

  }

  tapTripleScreen() {
    console.log("Tap TripleScreen button")

    this.isBollingerTrendFollowing = false
    this.isDefault = false
    this.isBollingerTrendReverse = false
    this.isTripleScreen = true

    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.EMA130Graph)
    this.firstChart.data.push(this.buyTripleScreenMarker)
    this.firstChart.data.push(this.sellTripleScreenMarker)

    this.stockGraph.showlegend = false
    this.buyReverseMarker.showlegend = false
    this.sellReverseMarker.showlegend = false

    this.secondChart.data = []
    this.secondChart.data.push(this.MACDSignalGraph)
    this.secondChart.data.push(this.MACDGraph)
    this.secondChart.data.push(this.MACDHistGraph)
    this.secondChart.layout.yaxis.title = ""

    this.thirdChart.data = []
    this.thirdChart.data.push(this.SLOWDGraph)
    this.thirdChart.data.push(this.FASTKGraph)
    this.thirdChart.layout.yaxis.title = ""

    this.firstChart.layout.shapes = []
    this.secondChart.layout.shapes = []
    this.thirdChart.layout.shapes = []
    this.buyTripleScreenLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });
    this.sellTripleScreenLine.forEach((element: any) => {
      this.firstChart.layout.shapes.push(element)
      this.secondChart.layout.shapes.push(element)
      this.thirdChart.layout.shapes.push(element)
    });


    let array = this.rawDataTripleScreen.slice(this.rawDataTripleScreen.length - 31, this.rawDataTripleScreen.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.ema130; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.ema130; }))
    
    let stockarray = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxstockY = Math.max.apply(Math, stockarray.map(function (o) { return o.high; }))
    let minstockY = Math.min.apply(Math, stockarray.map(function (o) { return o.low; }))
    
    let realMin = Math.min(minY, minstockY)
    let realMax = Math.max(maxY, maxstockY)

    this.firstChart.layout.yaxis.range = [realMin, realMax];
    this.rangeFirstY = [realMin, realMax]

    let maxY2 = Math.max.apply(Math, array.map(function (o) { return Math.max(Math.max(o.macd, o.macdhist), o._signal) }))
    let minY2 = Math.min.apply(Math, array.map(function (o) { return Math.max(Math.min(o.macd, o.macdhist), o._signal) }))
    this.secondChart.layout.yaxis.range = [minY2, maxY2];
    this.rangeSecondY = [minY2, maxY2]

    let maxY3 = Math.max.apply(Math, array.map(function (o) { return Math.max(o.fast_k, o.slow_d) }))
    let minY3 = Math.min.apply(Math, array.map(function (o) { return Math.min(o.fast_k, o.slow_d) }))
    this.thirdChart.layout.yaxis.range = [minY3, maxY3];
    this.rangeThirdY = [minY3, maxY3]

    this.revision++

  }

  public onClick(data: any) {
    debugger;
  }
}
