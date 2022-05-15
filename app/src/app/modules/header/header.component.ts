import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { PagestatusService } from 'src/app/services/pagestatus.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = ""
  public status: string = ""
  public types:string[] = 
  [
    "Korea", 
  "USA", 
  // "COIN"
]
  public country: string
  public updateGuide: string[] = 
  ["한국 주식에 대한 정보와 예측은 매일 오전 4시에 업데이트 됩니다.",
  //  "미국 주식에 대한 정보와 예측은 매일 점심 12시에 업데이트 됩니다.",
  //  "코인에 대한 정보와 예측은 매일 오전, 오후 2시에 업데이트 됩니다.",
  ]
  public num: number = -1;
  public tap: number = 0;

  constructor(private location: Location, private service: PagestatusService,
    @Inject("Version") public appVersion: string,) { }
  @ViewChild('toast') toast;

  ngOnInit(): void {
    this.service.getType().subscribe((value: any) => {

      switch(value){
        case "KRX":
          this.num = 0
          this.country = this.types[0]
          break
        case "NASDAQ":
          this.num = 1
          this.country = this.types[1]
          break
        // case "COIN":
        //   this.num = 2
        //   this.country = this.types[2]
        //   break
      }
    });
  }

  onClickTitle() {
    this.tap ++ ;
    if(this.tap > 5) this.toast.open(this.appVersion)
  }

  onPressBack() {
    this.location.back();
  }

  onTapGlobe(mrChange: MatRadioChange){
    this.num = mrChange.value
    switch(mrChange.value) {
      case 0:
        this.service.setType('KRX')
        break;
      case 1:
        this.service.setType('NASDAQ')
        break;
      // case 2:
      //   this.service.setType('COIN')
      //   break;
    }
  }
}
