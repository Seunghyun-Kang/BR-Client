import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder,FormControl,Validators  } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'firstguide',
  templateUrl: './firstguide.component.html',
  styleUrls: ['./firstguide.component.scss']
})
export class FirstguideComponent implements OnInit, OnDestroy {
  public presentDesc: string
  public masterNumber: string
  private descArray:Array<string>
  private exceptionDescArray:Array<string>
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
    private router:Router) { 
    this.descIndex = -1;
    this.descArray = [
      "안녕, 우리 주식 똑똑하게 해보자",
      "전화 번호 알려줘",
      "#1#, 반가워",
    ]
    this.exceptionDescArray = [
      "내가 아직 널 모르네.. 일단 친해지고 다시 만나자!",
      "핸드폰 번호가 아닌 것 같아, 잘가!"
    ]
    this.masterNumber = "01053690469"
    this.registeredNumber = {
      "01047965159": "상혁",
      "01072795036": "태웅",
      "01073737185": "정환",
      "01021709851": "지환",
      "01026232011": "진수",
      "01092471544": "은비",
      "01052618561": "아부지",
      "01030731999": "엄마",
      "01047929440": "수지",
      "01051218283": "수연",
      "01094122794": "보영",
    }
  }

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
        this.setAutoGuide(this.descIndex)
  }, 5000)
  }

  private setAutoGuide(index: number) {
    if(this.interval === undefined){
      this.interval = setInterval(() => {
        this.setAutoGuide(this.descIndex)
      }, 4000)
    }

    if(index < 3 && index !== 1){
    this.descIndex = this.descIndex + 1
    this.presentDesc = this.descArray[this.descIndex]
    
    if(this.descIndex === 1) {clearInterval(this.interval); this.interval = undefined}
    
    } else if(index >= 2){
      console.log("setAutoGuide called index > 3:: " + index)
      if(this.isAcceptAccount) this.router.navigate(['menu'])
      clearInterval(this.interval)
      clearTimeout(this.timeout)
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }
  onSubmit(value: any): void {
    console.warn('input::: ' + JSON.stringify(this.numform.value))
    this.checkFriends(value)
  }

  private checkFriends(value: any) {
    let flag = false;
    console.log("checkFriends called :: " + value.number)

    for (let key in this.registeredNumber) {
      if(key === String(value.number)) {
        console.log("MATCH!! :: " + this.registeredNumber[key])
        this.descArray[2] = this.descArray[2].replace('#1#', this.registeredNumber[key])
        this.setAutoGuide(this.descIndex+1)
        this.isAcceptAccount = true
      }
  }
  if(!this.isAcceptAccount) {
    this.descIndex = 5
    if(String(value.number) === this.masterNumber) {this.presentDesc = this.exceptionDescArray[2]; this.router.navigate(['menu'])}
    if(String(value.number).length <= 10 || String(value.number).length > 11 || (String(value.number)[0] !== '0' && String(value.number)[0] !== '1')) this.presentDesc = this.exceptionDescArray[1]
    else this.presentDesc = this.exceptionDescArray[0]
  }
  }
}
