import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';
import { companyData } from '../findcompany/findcompany.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public screenId = "home"
  public rawData: companyData[] = []
  
  constructor(private service: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    @Inject("Version") public appVersion: string, ) {
    this.service.setStatus("dashboard")
    console.log("Version:: " + appVersion)
  }

  ngOnInit(): void {
    this.requestService.getAllCompanies()
    .subscribe({
      next: (v: any) => {
        this.rawData = Object(v.body)
        this.dataService.setCompanyData(this.rawData)
        console.log(this.rawData)
      },
      error: (e: any) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
    });
  }

}
