import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { signalData } from '../stockdetail/stockdetail.model';

@Component({
  selector: 'app-menu',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public getData: boolean = false
  public status = "loading-forward";
  public guideIndex: number = -1;
  public guideist = [
    "너가 선택한 주식들의 최적화 포트폴리오가 어떤 비율인지 계산하는 기능",
    "특정 종목 차트와 매매 알고리즘을 보여주는 기능",
    "선택해봐"
  ]
  public rawLatestSignalTrend: signalData[] = []
  public rawLatestSignalReverse: signalData[] = []
  public rawLatestSignalTripleScreen: signalData[] = []

  constructor(private statusService: PagestatusService,
    private router: Router,
    private requestService: RequestService) {
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.statusService.setStatus("normal")
      this.getData = true
    }, 1000);
    console.log(this.guideIndex)

    this.requestService.getLatestBollingerTrendSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalTrend = Object(v.body)
        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });

    this.requestService.getLatestBollingerReverseSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalReverse = Object(v.body)
        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });

    this.requestService.getLatestTripleScreenSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalTripleScreen = Object(v.body)
        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });
  }

  guideIndexChanged(event: any) {
    this.guideIndex = event
    console.log(this.guideIndex)
  }

  onPressGetStock() {
    this.router.navigate(['findcompany'], {
      queryParams: {
        target: 'GetStockDetails'
      }
    })
  }

  onPressOptPortfolio() {
    this.router.navigate(['findcompany'], {
      queryParams: {
        target: 'OptPortfolio'
      }
    })
  }
}