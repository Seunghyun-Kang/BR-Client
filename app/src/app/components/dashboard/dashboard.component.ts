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

    this.requestService.getLatestBollingerTrendSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalTrend = Object(v.body)
        console.log(this.rawLatestSignalTrend)
        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });

    this.requestService.getLatestBollingerReverseSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalReverse = Object(v.body)
        console.log(this.rawLatestSignalReverse)
        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });

    this.requestService.getLatestTripleScreenSignal()
    .subscribe({
      next: (v: any) => {
        this.rawLatestSignalTripleScreen = Object(v.body)
        console.log(this.rawLatestSignalTripleScreen)

        },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });
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