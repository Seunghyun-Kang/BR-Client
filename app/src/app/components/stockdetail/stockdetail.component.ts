import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Location } from '@angular/common';
import { PlotlyModule } from "angular-plotly.js";
import { TradeViewSettings, TradeViewSettings2 } from './stockdetail.model';
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

export interface bollingerData {
  code: string,
  date: string,
  ma20: number,
  stddev: number,
  upper: number,
  lower: number,
  pb: number,
  bandwidth: number,
  mfi10: number
}
@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.scss']
})

export class StockdetailComponent implements OnInit {
  @ViewChild("chart", { static: true, read: ElementRef }) chart: ElementRef<
    PlotlyModule
  >;
  public code: string
  public companyName: string
  public rawData: priceData[]
  public rawDataBollinger: bollingerData[]

  public getData: boolean = false
  public getBollingerData: boolean = false
  public chartSettings = TradeViewSettings.settings;
  public chartSettings2 = TradeViewSettings2.settings;
  MILLISEC = 2629800000
  volumeColors = [] as any;

  constructor(
    private requestService: RequestService,
    private statusService: PagestatusService,
    private route: ActivatedRoute,
    private location: Location,
    private router:Router) { 
      this.route.queryParams.subscribe(params => {
          this.code = params['code'],
          this.companyName = params['companyName']
      });

      this.statusService.setStatus("loading-forward") 
    }

  ngOnInit(): void {
    this.requestService.getPrices(this.code) 
    .subscribe({
        next: (v) => {
          this.rawData = JSON.parse(Object(v.body))
          
          setTimeout(() => {
          this.statusService.setStatus("normal")
          this.setChartView(this.rawData)
          this.getData = true
          }, 1000);
        },
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

      this.requestService.getBollingerInfo(this.code) 
      .subscribe({
          next: (v) => {
            this.rawDataBollinger = Object(v.body)
            this.getBollingerData = true
            console.log(this.rawDataBollinger)
            this.setBollingerchart(this.rawDataBollinger)
          },
          error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
        });
  }
  
  setChartView(payload: priceData[]) {
    let startDate = new Date(payload[0].date).getTime()
    let endDate = new Date(payload[payload.length-1].date).getTime()
    let defaultstartDate = new Date(payload[payload.length-31].date).getTime()
    this.chartSettings.layout.xaxis.range = [defaultstartDate, endDate];
    this.chartSettings.layout.xaxis.rangeslider.range = [startDate, endDate];

    this.chartSettings2.layout.xaxis.range = [defaultstartDate, endDate];
    this.chartSettings2.layout.xaxis.rangeslider.range = [startDate, endDate];
   
    let volume = [];
    this.volumeColors = [];

    let previousVolume = 0;
    
    this.rawData.forEach(element => {
      this.chartSettings.data[0].x.push(element.date);
      this.chartSettings.data[0].close.push(element.close);
      this.chartSettings.data[0].high.push(element.high);
      this.chartSettings.data[0].low.push(element.low);
      this.chartSettings.data[0].open.push(element.open);

      this.chartSettings.data[1].x.push(element.date);
      this.chartSettings.data[1].y.push(element.close);
     
      volume.push(element.volume / 4000);

      if (previousVolume > element.volume) {
        this.volumeColors.push("#ef5350");
      } else {
        this.volumeColors.push("#26a69a");
      }
      previousVolume = element.volume;
    });

    console.log(this.chartSettings.data[0]);
  }

  setBollingerchart(payload: bollingerData[]) {
    payload.forEach(element => {
      this.chartSettings.data[2].x.push(element.date);
      this.chartSettings.data[2].y.push(element.upper);

      this.chartSettings.data[3].x.push(element.date);
      this.chartSettings.data[3].y.push(element.lower);

      this.chartSettings.data[4].x.push(element.date);
      this.chartSettings.data[4].y.push(element.ma20);

      this.chartSettings2.data[0].x.push(element.date);
      this.chartSettings2.data[0].y.push(element.pb * 100);

      this.chartSettings2.data[1].x.push(element.date);
      this.chartSettings2.data[1].y.push(element.mfi10);

    let array = payload.slice(payload.length-31, payload.length-1)
    let maxY = Math.max.apply(Math, array.map(function(o) { return o.upper; }))
    let minY = Math.min.apply(Math, array.map(function(o) { return o.lower; }))
    this.chartSettings.layout.yaxis.range = [minY, maxY];

    let maxY2 = Math.max.apply(Math, array.map(function(o) { return Math.max(o.pb, o.mfi10)+10; }))
    let minY2 = Math.min.apply(Math, array.map(function(o) { return Math.min(o.pb, o.mfi10)-10; }))
    this.chartSettings2.layout.yaxis.range = [minY2, maxY2];
    });
  }

  public onClick(data: any) {
    debugger;
  }
}
