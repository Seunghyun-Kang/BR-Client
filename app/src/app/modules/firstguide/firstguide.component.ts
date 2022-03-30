import { keyframes } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { FormBuilder,FormControl,Validators  } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'firstguide',
  templateUrl: './firstguide.component.html',
  styleUrls: ['./firstguide.component.scss']
})
export class FirstguideComponent implements OnInit {
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
      "안녕? 난 너 용돈벌이 도와주려는 OO 이야",
      "전화 번호만 알려줄래?",
      "올 #1#, 또 와줘서 고맙다",
      "다음거 좀 보여줄게"
    ]
    this.exceptionDescArray = [
      "안녕, 근데 개발자가 아직 널 모르네.. 걔랑 일단 친해지고 다시 만나자!",
      "그거 니 핸드폰 번호 아니잖아 말 안듣는 친구네, 잘가!",
      "주인님 빨리 개발합시다"
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
      // "1051218283": "수연",
      // "1094122794": "보영",
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
    
    } else if(index >= 3){
      console.log("setAutoGuide called index > 3:: " + index)
      if(this.isAcceptAccount) this.router.navigate(['menu'])
      clearInterval(this.interval)
      clearTimeout(this.timeout)
    }
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
    if(String(value.number).length <= 9 || String(value.number).length > 10 || (String(value.number)[0] !== '0' && String(value.number)[0] !== '1')) this.presentDesc = this.exceptionDescArray[1]
    else this.presentDesc = this.exceptionDescArray[0]
  }
  }
}
