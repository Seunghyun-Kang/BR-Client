import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { TradeViewSettings, priceData, bollingerData, signalData } from '../stockdetail/stockdetail.model';
import { DataService } from 'src/app/services/data.service';
const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-stockdstail-bollingerreverse',
  templateUrl: './stockdstail-bollingerreverse.component.html',
  styleUrls: ['./stockdstail-bollingerreverse.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdstailBollingerreverseComponent implements OnInit, OnDestroy {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  
  public code: string = ""
  public companyName: string = ""

  public rawStockData: priceData[] = []
  public rawDataBollinger: bollingerData[] = []
  public rawDataBollingerReverseSignal: signalData[] = []

  private stockGraph: any = {}
  private closeGraph: any = {}
  private bollingerUpperGraph: any = {}
  private bollingerLowerGraph: any = {}
  private M20Graph: any = {}
  private PBGraph: any = {}
  private PB100Graph: any = {}
  private MFI10Graph: any = {}
  private IIP21Graph: any = {}

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

    this.rawDataBollinger = this.dataService.getBollingerData(this.code)
    this.rawStockData = this.dataService.getStockData(this.code)
    this.rawDataBollingerReverseSignal = this.dataService.getBollingerReverseSignalData(this.code)

    this.initCommonGraphSettings()
    this.initDefaultGraph()
    this.initBollingerGraph()
    this.initBollingerSignalGraph()

    this.getData = true
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

  ngOnDestroy() {
    console.log("Destroy bollinger reverse")

    this.firstChart.data = []
    this.secondChart.data = []
    this.thirdChart.data = []
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

  initBollingerGraph() {
    console.log("initBollingerGraph called!")

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

    //graph drawing
    // if(!IS_MOBILE) this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)
    this.firstChart.data.push(this.bollingerUpperGraph)
    this.firstChart.data.push(this.bollingerLowerGraph)
    this.firstChart.data.push(this.M20Graph)
    let array = this.rawDataBollinger.slice(this.rawDataBollinger.length - 31, this.rawDataBollinger.length - 1)
    let maxY5 = Math.max.apply(Math, array.map(function (o) { return o.upper; }))
    let minY5 = Math.min.apply(Math, array.map(function (o) { return o.lower; }))
    this.firstChart.layout.yaxis.range = [minY5, maxY5];

    this.secondChart.data.push(this.PBGraph)
    let maxY6 = Math.max.apply(Math, array.map(function (o) { return o.pb; }))
    let minY6 = Math.min.apply(Math, array.map(function (o) { return o.pb; }))
    this.secondChart.layout.yaxis.range = [minY6, maxY6];
    this.secondChart.layout.yaxis.title = ""

    this.thirdChart.data.push(this.IIP21Graph)
    let maxY7 = Math.max.apply(Math, array.map(function (o) { return o.iip21; }))
    let minY7 = Math.min.apply(Math, array.map(function (o)  { return o.iip21; }))
    this.thirdChart.layout.yaxis.range = [minY7, maxY7];
    this.thirdChart.layout.yaxis.title = ""
  }

  initBollingerSignalGraph() {
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

    this.rawDataBollingerReverseSignal.forEach((element, index) => {
      var date: number = Number(new Date(element.date).getTime())
      var isValid: boolean = false

      if(index > 0 && this.rawDataBollingerReverseSignal[index-1].type !== element.type) {
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
      y0: -10000000000,
      x1: 0,
      y1: 10000000000,
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
