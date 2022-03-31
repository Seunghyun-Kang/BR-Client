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
  public codes:string[]
  public companylist: any
  public rawData: any
  public maxSharp: any
  public minRisk: any
  public getData: boolean = false
  public result1:string = "최적 포트폴리오는 "
  public result2:string = "최저 리스크 포트폴리오는 "
  public chartOptions: Partial<ChartOptions> | any;

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private route: ActivatedRoute,) {
      this.route.queryParams.subscribe(params => {
        this.codes = params['code']
        this.statusService.setStatus('loading-forward')
    });
    this.companylist = this.dataService.getCompanyData()
  }
  
  ngOnInit(): void {
    console.log(this.codes)
    this.requestService.getOptPortfolio(this.codes) 
    .subscribe({
        next: (v) => {
          this.rawData = JSON.parse(Object(v.body))
          console.log(this.rawData)
          setTimeout(() => {
            this.statusService.setStatus("normal") 
            this.getData = true
            this.initChartData()
          }, 1000);
        },
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  guideIndexChanged(event: any) {

  }

  initChartData() {
    let charData: any[] = []
    var maxS = 0;
    var minR = 100;
    this.rawData.forEach((element: any, index: number) => {
      let formatted = [Number((element.Risk*100).toFixed(2)), Number((element.Returns*100).toFixed(2))]

      if(element.Sharpe > maxS) {this.maxSharp = formatted; maxS = element.Sharpe;}
      if(element.Risk < minR) {this.minRisk = formatted; minR = element.Risk;}
      if(index%20 === 0 && formatted[0] < 100) charData.push(formatted)
    });
  

  console.log(this.maxSharp)
  console.log(this.minRisk)
  
  this.codes.forEach((element, index:any) => {
     this.result1 += this.dataService.getCompanyNamebyCode(element)+ '종목' + (this.maxSharp.element*100).toFixed(0) + '% '
     this.result2 += this.dataService.getCompanyNamebyCode(element)+ '종목' + (this.minRisk.element*100).toFixed(0) + '% '
     
     if(index < this.codes.length-1) {this.result2 += ', '; this.result1 += ', '}
     
  });

  this.chartOptions = {
    
    chart: {
      height: 400,
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
      max: 100,
      labels: {
        formatter: function(val: any) {
          return String(val.toFixed(0)) + '%'
        }
      },
      title: {
        text: "리스크",
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'poorstory',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
        },
    }
    },
    yaxis: {
      type: "numeric",
      min: -30,
      max: 70,
      tickAmount: 10,
      labels: {
        formatter: function(val: any) {
          return String(val) + '%'
        }
      },
      title: {
        text: "이윤",
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'poorstory',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
        },
    }
    },
    series: [{
      name: "임의의 비율의 포트폴리오",
      data:charData
    },{
      name: "최적 포트폴리오",
      data: [this.maxSharp]
    },{
      name: "최저 리스크 포트폴리오",
      data: [this.minRisk]
    }],
  };
  }
}
