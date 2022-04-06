import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'firstguide',
  templateUrl: './firstguide.component.html',
  styleUrls: ['./firstguide.component.scss']
})
export class FirstguideComponent implements OnInit, OnDestroy {
  public presentDesc: string
  public masterNumber: string
  private descArray: Array<string>
  private exceptionDescArray: Array<string>
  private timeout: any
  private interval: any
  private isAcceptAccount: boolean = false
  public descIndex: number
  public numform = this.formBuilder.group({
    number: new FormControl('', Validators.required),
  });
  private registeredNumber: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router) {
    this.descIndex = -1;
    this.descArray = [
      "안녕, 우리 주식 똑똑하게 해보자",
      "#1#, 반가워",
    ]
    this.exceptionDescArray = [
      "내가 아직 널 모르네.. 일단 친해지고 다시 만나자!",
      "핸드폰 번호가 아닌 것 같아, 잘가!"
    ]
    this.masterNumber = "1053690469"
    this.registeredNumber = {
      "1047965159": "상혁",
      "1072795036": "태웅",
      "1073737185": "정환",
      "1021709851": "지환",
      "1026232011": "진수",
      "1092471544": "은비",
      "1052618561": "아부지",
      "1030731999": "엄마",
      "1047929440": "수지",
      "1051218283": "수연",
      "1094122794": "보영",
    }
  }

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.setAutoGuide(this.descIndex)
    }, 5000)
  }

  private setAutoGuide(index: number) {
    console.log("setAutoGuide called index :: " + index)
    if (this.interval === undefined) {
      this.interval = setInterval(() => {
        this.setAutoGuide(this.descIndex)
      }, 4000)
    }

    if (index < 2 && index !== 0) {
      this.descIndex = this.descIndex + 1
      if (this.descIndex <= 1) this.presentDesc = this.descArray[this.descIndex]
      if (index === 1) {
        if (this.isAcceptAccount) {
          setTimeout(() => {
            clearInterval(this.interval)
            clearTimeout(this.timeout)
            this.router.navigate(['menu'])
          }, 2000);
        }
      }
    } else if(index > 3) {
      clearInterval(this.interval)
      clearTimeout(this.timeout)
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  onChange(event: any): void {
    if(event.length >= 11)
    this.checkFriends(event.substr(1,))
  }
  
  onSelectedOption(event: any) {
    this.checkFriends(event)
  }

  private checkFriends(value: any) {
    let flag = false;
    console.log("checkFriends called :: " + value)

    for (let key in this.registeredNumber) {
      if (key === String(value)) {
        console.log("MATCH!! :: " + this.registeredNumber[key] + " index: " + this.descIndex)
        this.descArray[this.descIndex + 1] = this.descArray[this.descIndex + 1].replace('#1#', this.registeredNumber[key])
        this.setAutoGuide(this.descIndex + 1)
        this.isAcceptAccount = true
      }
    }
    if (!this.isAcceptAccount) {
      this.descIndex = 5
      if (String(value) === this.masterNumber) { this.presentDesc = this.exceptionDescArray[2]; this.router.navigate(['menu']) }
      if (String(value).length <= 9 || String(value).length > 10 || (String(value)[0] !== '0' && String(value)[0] !== '1')) this.presentDesc = this.exceptionDescArray[1]
      else this.presentDesc = this.exceptionDescArray[0]
    }
  }
}
