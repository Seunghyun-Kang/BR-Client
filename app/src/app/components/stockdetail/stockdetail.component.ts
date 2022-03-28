import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';

import { PlotlyModule } from "angular-plotly.js";
import { TradeViewSettings } from './stockdetail.model';

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
  public chartSettings = TradeViewSettings.settings;
  MILLISEC = 2629800000
  volumeColors = [] as any;

  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
          this.code = params['code'],
          this.companyName = params['companyName']
      });

      console.log('StockdetailComponent Constructor, code is ::' + this.code);
  }

  ngOnInit(): void {
    // this.requestService.getCompanyName(this.code) 
    // .subscribe({
    //     next: (v) => console.log("RESONSE FROM SERVER :: " + JSON.stringify(v)),
    //     error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    //   });

    this.requestService.getPrices(this.code) 
    .subscribe({
        next: (v) => {
          this.rawData = JSON.parse(Object(v.body))
          this.setChartView(this.rawData)
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

    let array = this.rawData.slice(payload.length-31, payload.length-1)
    let maxY = Math.max.apply(Math, array.map(function(o) { return o.high; }))
    let minY = Math.min.apply(Math, array.map(function(o) { return o.low; }))
    this.chartSettings.layout.yaxis.range = [minY, maxY];
   
    let volume = [];
    this.volumeColors = [];

    let previousVolume = 0;
    
    this.rawData.forEach(element => {
      this.chartSettings.data[0].x.push(element.date);
      this.chartSettings.data[0].close.push(element.close);
      this.chartSettings.data[0].high.push(element.high);
      this.chartSettings.data[0].low.push(element.low);
      this.chartSettings.data[0].open.push(element.open);
     
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

  public onClick(data: any) {
    debugger;
  }
}
