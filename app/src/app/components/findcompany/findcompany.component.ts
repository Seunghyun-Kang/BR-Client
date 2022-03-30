import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public target: string = ""
  public guideist = [
  ]
  constructor(private statusService: PagestatusService,
    private requestService: RequestService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router:Router) {
      this.route.queryParams.subscribe(params => {
        this.target = params['target']

        var loadingType
        switch(this.target){
          case "GetStockDetails":
            loadingType = "loading-right"
            break;
          case "OptPortfolio":
            loadingType = "loading-left"
            break;
          default:
            loadingType = "loading-forward"
            break;
        }
        this.statusService.setStatus(loadingType)
    });
    }

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
