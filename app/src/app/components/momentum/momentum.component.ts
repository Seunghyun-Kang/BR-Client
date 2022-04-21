import { Component, OnInit, ViewChild } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { DataService } from 'src/app/services/data.service';
import { momentumData } from '../stockdetail/stockdetail.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-momentum',
  templateUrl: './momentum.component.html',
  styleUrls: ['./momentum.component.scss']
})

export class MomentumComponent implements OnInit {
  public lastday: number = 90
  public stockNum: number = 30
  public type: string
  public totalRate: string = ""
  public getData: boolean = false

  public momentumData: momentumData[] = []

  public daySelected: string = "1";
  private companyInfo: any[] = []

  public selectedIndex = 0
  private subscription: Subscription;

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private router: Router,
  ) {
    this.statusService.setStatus("loading-forward")
  }

  ngOnInit(): void {
    this.subscription = this.statusService.getType().subscribe((value) => {
      console.log("TYPE ::" + value);
      this.type = value
      this.resetAllData()

      this.companyInfo = this.dataService.getCompanyData(this.type)
      console.log(this.companyInfo)
      if (this.companyInfo === undefined) {
        this.requestCompanyData(this.type)
      } else {
        this.momentumData = this.dataService.getMomentumData(this.lastday, this.type)
        if (this.momentumData === undefined) {this.requestMomentum(this.type); }
        else {this.statusService.setStatus('normal');this.calTotalRate();this.getData = true}
      }
    });
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy")
    this.subscription.unsubscribe()
  }

  resetAllData() {
    this.momentumData = []
    this.companyInfo = undefined
  }

  requestCompanyData(type: string) {
    this.requestService.getAllCompanies(type)
      .subscribe({
        next: (v: any) => {
          this.dataService.setCompanyData(Object(v.body), type)
          this.momentumData = this.dataService.getMomentumData(this.lastday, this.type)
          if (this.momentumData === undefined) this.requestMomentum(this.type)
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  requestMomentum(type: string) {
    this.statusService.setStatus("loading-forward")
    this.getData = false
    this.requestService.getMomentum(this.lastday, this.stockNum, type)
      .subscribe({
        next: (v: any) => {
          this.parseMomentum(JSON.parse(Object(v.body)))
          this.statusService.setStatus('normal')
          this.getData = true
        },
        error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  calTotalRate() {
    var total = 0
    this.momentumData.forEach(element => {
      total += Number(element.rate.split('% ')[0])
    });
    this.totalRate = "총 수익률 :" + String(total) + "%"
  }

  parseMomentum(data: any) {
    this.momentumData = []
    var total = 0

    data.forEach((element) => {
      let item: momentumData = {
        code: element.code,
        company: this.dataService.getCompanyNamebyCode(element.code, this.type),
        rate: String(element.returns.toFixed(2)) + "% "
      }
      this.momentumData.push(item)
      total += element.returns
    });
    this.totalRate = "총 상승률 :  " + String(total.toFixed(2)) + "%"
    this.dataService.setMomentumData(this.momentumData, this.lastday, this.type)
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  onTapCompany(code: string, company: string) {
    this.router.navigate(['stockdetail'], {
      queryParams: {
        code: code,
        companyName: company
      }
    })
  }

  onChangeDay(event: any) {
    console.log(event.value)

    switch (Number(event.value)) {
      case 1: { this.lastday = 90; this.daySelected = event.value; break; }
      case 2: { this.lastday = 180; this.daySelected = event.value; break; }
      case 3: { this.lastday = 270; this.daySelected = event.value; break; }
      case 3: { this.lastday = 360; this.daySelected = event.value; break; }
      default: break;
    }

    this.momentumData = this.dataService.getMomentumData(this.lastday, this.type)
    if (this.momentumData === undefined) {
      this.requestMomentum(this.type)
    } else {
      this.calTotalRate();
    }
  }
}
