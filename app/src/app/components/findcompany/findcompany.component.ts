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
  public codesForOpt: any = []
  public target: string = ""
  private isTapButton: boolean = false
  public presentGuide: string[]
  public OptGuideist = [
    "회사들을 선택하면 각각 몇%로 투자해야하는지 알려줄게 (최소 2개)",
  ]
  public StockGuideist = [
    "확인하고 싶은 회사명을 검색해봐",
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
    console.log(event)
 
    if(this.target === 'GetStockDetails'){
    this.rawData.forEach(element => {
      if(element.company === event[0]){
        console.log("match company!!!")
        this.router.navigate(['stockdetail'], { queryParams: { 
          code: element.code,
          companyName: this.dataService.getCompanyNamebyCode(element.code)
         }})
      }
    });
  } else if(this.target === 'OptPortfolio') {
    let codelist: any = []
    this.codesForOpt = event
    this.rawData.forEach(element => {
      this.codesForOpt.forEach((item: any) => {
        if(element.company === item){
          codelist.push(element.code)
          console.log("match company!!!" + codelist)
          if((codelist.length >= 10 && !this.isTapButton) || (codelist.length > 1 && this.isTapButton))
          {
            this.router.navigate(['optimalportfolio'], { queryParams: { 
                code: codelist
               }})
          }
        }
      });
    });
  }

  }

  guideIndexChanged(event: any) {
    this.guideIndex = event
  }

  onTapClick() {
    this.isTapButton = true
    if(this.codesForOpt.length > 1) this.onSelectedOption(this.codesForOpt)
    this.isTapButton = false
  }
}
