import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlotlyModule, PlotlyService } from "angular-plotly.js";
import { bollingerData, priceData, signalData, TradeViewSettings, tripleScreenData } from '../stockdetail/stockdetail.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-stockdetail-default',
  templateUrl: './stockdetail-default.component.html',
  styleUrls: ['./stockdetail-default.component.scss']
})

// const graph = new TradeViewSettings()
export class StockdetailDefaultComponent implements OnInit {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  public code: string = ""
  public companyName: string = ""

  public rawStockData: priceData[] = []
  public rawDataBollingerTrendSignal: signalData[] = []
  public rawDataBollingerReverseSignal: signalData[] = []
  public rawDataTripleScreenSignal: signalData[] = []

  private stockGraph: any = {}
  private closeGraph: any = {}

  public graphList = [] as any

  public getData: boolean = false

  public firstChart = new TradeViewSettings().settings;
  public revision = 1

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

    this.getData = true
    this.initCommonGraphSettings()
    this.initDefaultGraph()
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit called!")
  }

  initCommonGraphSettings() {
    console.log("initCommonGraphSettings called!")

    let startDate = new Date(this.rawStockData[0].date).getTime()
    let endDate = new Date(this.rawStockData[this.rawStockData.length - 1].date).getTime()
    let defaultstartDate = new Date(this.rawStockData[this.rawStockData.length - 60].date).getTime()

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
    this.firstChart.layout.height = '500'

    let array = this.rawStockData.slice(this.rawStockData.length - 31, this.rawStockData.length - 1)
    let maxY = Math.max.apply(Math, array.map(function (o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function (o) { return o.low; }))
    this.firstChart.layout.yaxis.range = [minY, maxY];

    this.revision++
  }
}
