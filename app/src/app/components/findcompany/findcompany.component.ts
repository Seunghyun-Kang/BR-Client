import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { RequestService } from 'src/app/services/request.service';

export interface companyData {
  code: string,
  company: string,
  last_update: string
}

@Component({
  selector: 'app-findcompany',
  templateUrl: './findcompany.component.html',
  styleUrls: ['./findcompany.component.scss']
})

export class FindcompanyComponent implements OnInit {
  public screenId = "FindCompany"
  public rawData: companyData[]
  public getData: boolean = false
  public status = "loading-forward";

  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private router:Router) {
      this.statusService.setStatus("loading-forward") }

  ngOnInit(): void {
    this.requestService.getAllCompanies() 
    .subscribe({
        next: (v) => {
          this.rawData = Object(v.body)
          this.dataService.setCompanyData(this.rawData)
          console.log(this.rawData)
          setTimeout(() => {
            this.statusService.setStatus("normal") 
            this.getData = true
          }, 1000);
        },
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

  onSelectedOption(event: any) {
    console.log(event[0])

    this.rawData.forEach(element => {
      if(element.company === event[0]){
        console.log("match company!!!")
        this.router.navigate(['stockdetail'], { queryParams: { 
          code: element.code
         }})
      }
    });
    
  }

}
