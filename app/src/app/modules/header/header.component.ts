import { Component, OnInit, Input } from '@angular/core';
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
  public types:string[] = ["Korea", "USA"]
  public country: string
  public updateGuide: string[] = 
  ["한국 주식에 대한 정보와 예측은 매일 오전 4시에 업데이트 됩니다.",
   "미국 주식에 대한 정보와 예측은 매일 점심 12시에 업데이트 됩니다."]
  public num: number = -1;

  constructor(private location: Location, private service: PagestatusService) { }

  ngOnInit(): void {
    this.service.getType().subscribe((value: any) => {
      switch(value){
        case "KRX":
          this.country = this.types[0]
          break
        case "NASDAQ":
          this.country = this.types[1]
          break
      }
    });
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
    }
  }
}
