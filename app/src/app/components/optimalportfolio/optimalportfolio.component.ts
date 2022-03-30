import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
} from "ng-apexcharts";
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-optimalportfolio',
  templateUrl: './optimalportfolio.component.html',
  styleUrls: ['./optimalportfolio.component.scss']
})
export class OptimalportfolioComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public codes:string
  public rawData: any
  public getData: boolean = false
  public chartOptions: Partial<ChartOptions> | any;
  public presentGuide = [
    "데이터 파싱 로직이 아직이야ㅎ",
  ]

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private route: ActivatedRoute,) {
      this.route.queryParams.subscribe(params => {
        this.codes = params['code']
        this.statusService.setStatus('loading-forward')
    });
  }
  
  ngOnInit(): void {
    this.requestService.getOptPortfolio(this.codes) 
    .subscribe({
        next: (v) => {
          this.rawData = Object(v.body)
          console.log(this.rawData)
          setTimeout(() => {
            this.statusService.setStatus("normal") 
            this.getData = true
          }, 1000);
        },
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

    this.chartOptions = {
      series: [{
        name: "삼성전자",
        data: [
        [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
      },{
        name: "셀트리온",
        data: [
        [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
      },{
        name: "현대자동차",
        data: [
        [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
      }],
      chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        }
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val: any) {
            return parseFloat(val).toFixed(1)
          }
        }
      },
      yaxis: {
        tickAmount: 7
      }
    };
  }

  guideIndexChanged(event: any) {

  }
}
