import { Component, OnInit, ViewChild } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
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

export type ChartElem = {
  name: string,
  data: any[]
};

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
  public codes: string[] = []
  public companylist: any
  public rawData: any
  public maxSharpFull: any
  public minRiskFull: any
  public maxSharp: any
  public maxProfit: any
  public minProfit: any
  public minRisk: any
  public maxRisk: any
  public getData: boolean = false
  public result1: string = "최적 포트폴리오: "
  public result2: string = "최저 리스크 포트폴리오: "
  public result1_portion: string = ""
  public result2_portion: string = ""
  public chartOptions: Partial<ChartOptions> | any;
  public type: string
  
  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private route: ActivatedRoute, ) {
    this.route.queryParams.subscribe((params: any) => {
      this.codes = params['code']
      this.statusService.setStatus('loading-forward')
    });
    this.companylist = this.dataService.getCompanyData()
  }

  ngOnInit(): void {
    console.log(this.codes)
    this.requestService.getOptPortfolio(this.codes)
      .subscribe({
        next: (v: any) => {
          this.rawData = JSON.parse(Object(v.body))
          console.log(this.rawData)
          setTimeout(() => {
            this.statusService.setStatus("normal")
            this.getData = true
            this.initChartData()
          }, 1000);
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  guideIndexChanged(event: any) {

  }

  initChartData() {
    let charData: any[] = []
    var maxS = 0;
    var maxP = 0;
    var maxR = 0;
    var minP = 100;
    var minR = 100;
    this.rawData.forEach((element: any, index: number) => {
      let formatted = [Number((element.Risk * 100).toFixed(2)), Number((element.Returns * 100).toFixed(2))]
      if (element.Sharpe > maxS) {
        this.maxSharp = formatted
        maxS = element.Sharpe
        this.maxSharpFull = element
      }
      if (element.Risk < minR) {
        this.minRisk = formatted
        minR = element.Risk
        this.minRiskFull = element
      }
      if (element.Risk > maxR) {
        this.maxRisk = formatted
        maxR = element.Risk
      }
      if (formatted[1] < minP) {
        minP = formatted[1]
        this.minProfit = formatted
      }
      if (formatted[1] > maxP) {
        maxP = formatted[1]
        this.maxProfit = formatted
      }
      if (index % 10 === 0 && formatted[0] < 100) charData.push(formatted)
    });


    console.log(this.maxSharpFull)
    this.result1 += '리스크: ' + this.maxSharp[0] + '%, 이윤: ' + this.maxSharp[1] + '%'
    console.log(this.minRisk)
    this.result2 += '리스크: ' + this.minRisk[0] + '%, 이윤: ' + this.minRisk[1] + '%'
    console.log(this.maxRisk)
    console.log(this.minProfit)
    console.log(this.maxProfit)

    this.codes.forEach((element, index: any) => {
      let info = this.dataService.getCompanyNamebyCode(element, this.type)
      this.result1_portion += info + ' ' + (this.maxSharpFull[element] * 100).toFixed(0) + '%'
      this.result2_portion += info + ' ' + (this.minRiskFull[element] * 100).toFixed(0) + '%'

      if (index < this.codes.length - 1) { this.result2_portion += ', '; this.result1_portion += ', ' }

    });

    this.chartOptions = {

      chart: {
        height: 400,
        width: '90%',
        type: 'scatter',
        animations: {
          enabled: false,
          dynamicAnimation: {
            enabled: false
          }
        }
      },
      xaxis: {
        type: "numeric",
        min: this.minRisk[0] - 5,
        max: this.maxRisk[0] + 5,
        labels: {
          formatter: function (val: any) {
            return String(val.toFixed(0)) + '%'
          },
          style: {

            colors: ['#FFFFFF'],
            fontSize: '12px',
            fontFamily: 'hyundai-card',
            cssClass: 'apexcharts-yaxis-title',
          }
        },
        title: {
          text: "리스크",
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#FFFFFF',
            fontSize: '12px',
            fontFamily: 'hyundai-card',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        }
      },
      yaxis: {
        type: "numeric",
        min: this.minProfit[1] - 5,
        max: this.maxProfit[1] + 5,
        tickAmount: 10,
        labels: {
          formatter: function (val: any) {
            return String(val.toFixed(0)) + '%'
          },
          style: {
            colors: ['#FFFFFF'],
            fontSize: '12px',
            fontFamily: 'hyundai-card',
            cssClass: 'apexcharts-yaxis-title',
          }
        },
        title: {
          text: "이익",
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#FFFFFF',
            fontSize: '12px',
            fontFamily: 'hyundai-card',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        }
      },
      series: [{
        name: "임의의 비율의 포트폴리오",
        data: charData
      }, {
        name: "최적 포트폴리오",
        data: [this.maxSharp]
      }, {
        name: "최저 리스크 포트폴리오",
        data: [this.minRisk]
      }],
    };
  }
}
