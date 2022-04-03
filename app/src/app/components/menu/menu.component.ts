import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagestatusService } from 'src/app/services/pagestatus.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public getData: boolean = false
  public status = "loading-forward";
  public guideIndex: number = -1;
  public guideist = [
    "아직까지는 두 개의 기능밖에 없어",
    "첫번째는 너가 선택한 주식들의 최적화 포트폴리오가 어떤 비율인지 계산해주는거야",
    "두번째는 특정 종목 차트와 매매 알고리즘을 보여주는거야",
    "선택하면 더 자세히 설명해줄게"
  ]
  constructor(private statusService: PagestatusService,
    private router:Router) {
      this.statusService.setStatus("loading-forward") }

  ngOnInit(): void {
          setTimeout(() => {
            this.statusService.setStatus("normal") 
            this.getData = true
          }, 1000);
          console.log(this.guideIndex)
  }

  guideIndexChanged(event: any) {
    this.guideIndex = event
    console.log(this.guideIndex)
  }

  onPressGetStock() {
    this.router.navigate(['findcompany'], { queryParams: { 
      target: 'GetStockDetails'
     }})
  }

  onPressOptPortfolio() {
    this.router.navigate(['findcompany'], { queryParams: { 
      target: 'OptPortfolio'
     }})
  }
}