import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { priceData, signalData, TradeViewSettings } from '../stockdetail/stockdetail.model';
import { DataService } from 'src/app/services/data.service';
const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export interface signalStatus {
  lastDate : string
  lastPrice: number
}

@Component({
  selector: 'app-stockdetail-default',
  templateUrl: './stockdetail-default.component.html',
  styleUrls: ['./stockdetail-default.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdetailDefaultComponent implements OnInit, OnDestroy {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  public code: string = ""
  public companyName: string = ""

  public rawStockData: priceData[] = []
  public rawDataBollingerTrendSignal: signalData[] = []
  public rawDataBollingerReverseSignal: signalData[] = []
  public rawDataTripleScreenSignal: signalData[] = []

  public validBollingerTrendSignal: signalData[] = []
  public validBollingerReverseSignal: signalData[] = []
  public validTripleScreenSignal: signalData[] = []

  private stockGraph: any = {}
  private closeGraph: any = {}

  public getData: boolean = false

  public firstChart = new TradeViewSettings().settings;
  public revision = 1
  
  public trendStatus: string = ""
  public reverseStatus: string = ""
  public tripleScreenStatus: string = ""

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    public plotlyService: PlotlyService) {
    this.route.queryParams.subscribe((params: any) => {
      this.code = params['code']
      this.companyName = params['companyName']
    });
    const Plotly = plotlyService.getPlotly();
  }

  ngOnInit(): void {
    console.log("ngOnInit called!")

    this.rawStockData = this.dataService.getStockData(this.code)
    this.rawDataBollingerReverseSignal = this.dataService.getBollingerReverseSignalData(this.code)
    this.rawDataBollingerTrendSignal = this.dataService.getBollingerTrendSignalData(this.code)
    this.rawDataTripleScreenSignal = this.dataService.getTripleScreenSignalData(this.code)

    console.log(this.rawDataTripleScreenSignal)
    this.getData = true
    this.initCommonGraphSettings()
    this.initDefaultGraph()
    this.initSignalsData()
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called!")
  }

  ngOnDestroy() {
    console.log("ngDestroy called!")
    this.firstChart.data = []
  }

  initCommonGraphSettings() {
    console.log("initCommonGraphSettings called!")

    let startDate = new Date(this.rawStockData[0].date).getTime()
    let endDate = new Date(this.rawStockData[this.rawStockData.length - 1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length - 60].date).getTime()

    this.firstChart.layout.xaxis.range = [defaultstartDate, endDate];
    this.firstChart.layout.xaxis.rangeslider.range = [startDate, endDate];
  }

  initSignalsData(){
    let percent: number

    var lastInfo: signalStatus = {
      lastDate: "1999-01-01",
      lastPrice: 0
    }
    this.rawDataBollingerReverseSignal.forEach((element, index) => {
    
      if(index > 0 && this.rawDataBollingerReverseSignal[index-1].type !== element.type) {
        this.validBollingerReverseSignal.push(element)

        switch(element.type) {
          case "buy":
            percent = ((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.reverseStatus = "$lastdate $lastprice원 매수 후 매도 신호 대기중..".replace("$lastdate", lastInfo.lastDate).replace("$lastprice", String(lastInfo.lastPrice))
            break
          case "sell":
            percent = ((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.reverseStatus = "$lastdate $lastprice원 매도($percent% 손익) 후 매수 신호 대기중..".replace("$lastdate", lastInfo.lastDate).replace("$lastprice", String(lastInfo.lastPrice)).replace("$percent", String(percent.toFixed(2)))
            break
        }
        lastInfo.lastDate = element.date
        lastInfo.lastPrice = element.close
      }
    });

    var lastInfo: signalStatus = {
      lastDate: "1999-01-01",
      lastPrice: 0
    }
    this.rawDataBollingerTrendSignal.forEach((element, index) => {
     
      if(index > 0 && this.rawDataBollingerTrendSignal[index-1].type !== element.type) {
        this.validBollingerTrendSignal.push(element)

        switch(element.type) {
          case "buy":
            percent = ((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.trendStatus = "$lastdate $lastprice원 매수 후 매도 신호 대기중..".replace("$lastdate", lastInfo.lastDate).replace("$lastprice", String(lastInfo.lastPrice))
            break
          case "sell":
            percent = ((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.trendStatus = "$lastdate $lastprice원 매도($percent% 손익) 후 매수 신호 대기중..".replace("$lastdate", lastInfo.lastDate).replace("$lastprice", String(lastInfo.lastPrice)).replace("$percent", String(percent.toFixed(2)))
            break
        }
        lastInfo.lastDate = element.date
        lastInfo.lastPrice = element.close
      }
    });

    var lastInfo: signalStatus = {
      lastDate: "",
      lastPrice: 0
    }
    this.rawDataTripleScreenSignal.forEach((element, index) => { 
      if(index > 0 && this.rawDataTripleScreenSignal[index-1].type !== element.type) {
        this.validTripleScreenSignal.push(element)
        
        console.log(lastInfo)
        switch(element.type) {
          case "buy":
            percent =((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.tripleScreenStatus = "$lastdate $lastprice원 매수 후 매도 신호 대기중..".replace("$lastdate", element.date).replace("$lastprice", String(lastInfo.lastPrice))
            break
          case "sell":
            percent = ((element.close - lastInfo.lastPrice) / lastInfo.lastPrice)* 100
            this.tripleScreenStatus = "$lastdate $lastprice원 매도($percent% 손익) 후 매수 신호 대기중..".replace("$lastdate", element.date).replace("$lastprice", String(lastInfo.lastPrice)).replace("$percent", String(percent.toFixed(2)))
            break
        }
        lastInfo.lastDate = String(element.date)
        lastInfo.lastPrice = element.close
      }
    });
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
    // if(!IS_MOBILE) this.firstChart.data.push(this.stockGraph)
    this.firstChart.data.push(this.closeGraph)

    let endDate = new Date(this.rawStockData[this.rawStockData.length - 1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length - 31].date).getTime()
    this.firstChart.layout.xaxis.range = [defaultstartDate, endDate];
    this.firstChart.layout.height = '450'

    let array = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.low; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    this.revision++
  }
}
