import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { PlotlyModule } from "angular-plotly.js";
import { TradeViewSettings } from './stockdetail.model';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { DataService } from 'src/app/services/data.service';

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

  public rawStockData: priceData[] = []
  public rawDataBollinger: bollingerData[] = []

  private stockGraph: any = {} 
  private closeGraph:any = {}
  private bollingerUpperGraph:any = {}
  private bollingerLowerGraph:any = {}
  private M20Graph:any = {}
  private PBGraph:any = {}
  private PB100Graph:any = {}
  private MFI10Graph:any = {}
  private IIP21Graph:any = {}
  public graphList = [] as any

  public getData: boolean = false
  public getBollingerData: boolean = false
  public firstChart = new TradeViewSettings().settings;
  public secondChart = new TradeViewSettings().settings;
  public thirdChart = new TradeViewSettings().settings;

  constructor(
    private requestService: RequestService,
    private statusService: PagestatusService,
    private dataService: DataService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe((params:any) => {
          this.code = params['code']
          this.companyName = this.dataService.getCompanyNamebyCode(this.code)
      });
      this.statusService.setStatus("loading-forward") 
    }

  ngOnInit(): void {
    this.requestService.getPrices(this.code) 
    .subscribe({
        next: (v: any) => {
          this.rawStockData = JSON.parse(Object(v.body))
          
          setTimeout(() => {
          this.statusService.setStatus("normal")
          this.getData = true

          this.initCommonGraphSettings()
          this.initDefaultGraph()
          }, 1000);
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
  }

  initCommonGraphSettings() {
    console.log(this.rawStockData[this.rawStockData.length-1].date)
    let startDate = new Date(this.rawStockData[0].date).getTime()
    let endDate = new Date(this.rawStockData[this.rawStockData.length-1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length-31].date).getTime()
    
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
      line: { color: "rgba(31,119,180,1)" },
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
      line: { color: "#55DC67" },
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
      line: { color: "rgba(87, 255, 125, 1)" },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%b * 100"
    }
    this.PBGraph = {
      x: [],
      y: [],
      line: { color: "rgba(122, 226, 175, 1)"  },
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "%b",
      showlegend: true
    }
    this.MFI10Graph = {
      x: [],
      y: [],
      line: {color: "rgba(243, 89, 125, 1)"},
      type: 'scatter',
      xaxis: "x",
      yaxis: "y",
      name: "10일 Money flow"
    }

    this.IIP21Graph = {
      x: [],
      y: [],
      marker: {
        color: 'rgba(239, 32, 100, 1)'
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

  tapDefault() {
    console.log("Tap default button")
    this.isDefault = true
    this.isBollingerTrendFollowing = false
    this.isBollingerTrendReverse = false

    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)

    let array = this.rawStockData.slice(this.rawStockData.length-31, this.rawStockData.length-1)
    let maxY = Math.max.apply(Math, array.map(function(o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function(o) { return o.low; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    this.firstChart.layout.yaxis.title = "가격"
  }

  tapBolingerTrend() {
    console.log("Tap BolingerTrend button")

    this.isBollingerTrendFollowing = true
    this.isDefault = false
    this.isBollingerTrendReverse = false

    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)
    
    this.secondChart.data = []
    this.secondChart.data.push(this.closeGraph)
    this.secondChart.data.push(this.bollingerLowerGraph)
    this.secondChart.data.push(this.bollingerUpperGraph)
    this.secondChart.data.push(this.M20Graph)

    this.thirdChart.data = []
    this.thirdChart.data.push(this.PB100Graph)
    this.thirdChart.data.push(this.MFI10Graph)
    this.thirdChart.layout.yaxis.title = ""

    let array = this.rawDataBollinger.slice(this.rawDataBollinger.length-31, this.rawDataBollinger.length-1)
    let maxY = Math.max.apply(Math, array.map(function(o) { return o.upper; }))
    let minY = Math.min.apply(Math, array.map(function(o) { return o.lower; }))
    this.secondChart.layout.yaxis.range = [minY, maxY];

    let maxY2 = Math.max.apply(Math, array.map(function(o) { return Math.max(o.pb*100, o.mfi10); }))
    let minY2 = Math.min.apply(Math, array.map(function(o) { return Math.min(o.pb*100, o.mfi10); }))
    this.thirdChart.layout.yaxis.range = [minY2, maxY2];
  }

  tapBollingerReverse() {
    console.log("Tap BolingerReverse button")
    
    this.isBollingerTrendFollowing = false
    this.isDefault = false
    this.isBollingerTrendReverse = true

    this.firstChart.data = []
    this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.bollingerLowerGraph)
    this.firstChart.data.push(this.bollingerUpperGraph)
    this.firstChart.data.push(this.closeGraph)
    this.firstChart.data.push(this.M20Graph)

    this.secondChart.data = []
    this.secondChart.data.push(this.PBGraph)
    this.secondChart.layout.yaxis.title = ""

    this.thirdChart.data = []
    this.thirdChart.data.push(this.IIP21Graph)
    this.thirdChart.layout.yaxis.title = ""

    
    let array = this.rawDataBollinger.slice(this.rawDataBollinger.length-31, this.rawDataBollinger.length-1)
    let maxY = Math.max.apply(Math, array.map(function(o) { return o.upper; }))
    let minY = Math.min.apply(Math, array.map(function(o) { return o.lower; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    let maxY2 = Math.max.apply(Math, array.map(function(o) { return o.pb; }))
    let minY2 = Math.min.apply(Math, array.map(function(o) { return o.pb; }))
    this.secondChart.layout.yaxis.range = [minY2, maxY2];

    let maxY3 = Math.max.apply(Math, array.map(function(o) { return o.iip21; }))
    let minY3 = Math.min.apply(Math, array.map(function(o) { return o.iip21; }))
    this.thirdChart.layout.yaxis.range = [minY3, maxY3];
  }

  public onClick(data: any) {
    debugger;
  }
}
