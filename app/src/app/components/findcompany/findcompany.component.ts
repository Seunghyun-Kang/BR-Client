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
  public guideIndex = -1
  public getData: boolean = false
  public status = "loading-forward";
  public target: string = ""
  public presentGuide: string[]
  public OptGuideist = [
    "데이터는 다 만들었는데 아직 UI 못 만듬ㅠ",
    "일단은 주식 하나만 선택해서 차트만 보구가ㅎ"
  ]
  public StockGuideist = [
    "아래 창에 확인하고 싶은 회사명을 검색해봐",
    "추후 해당 주식의 매매 타이밍을 계산해서 나온 결과를 보여줄게"
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
            this.presentGuide = this.StockGuideist
            break;
          case "OptPortfolio":
            loadingType = "loading-left"
            this.presentGuide = this.OptGuideist
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

  guideIndexChanged(event: any) {
    this.guideIndex = event
  }

}
