import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,Validators  } from '@angular/forms';

@Component({
  selector: 'firstguide',
  templateUrl: './firstguide.component.html',
  styleUrls: ['./firstguide.component.scss']
})
export class FirstguideComponent implements OnInit {
  public presentDesc: string
  private descArray:Array<string>
  private exceptionDescArray:Array<string>
  private timeout: any
  private interval: any
  public descIndex: number
  public numform = this.formBuilder.group({
    number: new FormControl('', Validators.required),
  });
  private registeredNumber: any;

  constructor(private formBuilder: FormBuilder) { 
    this.descIndex = -1;
    this.descArray = [
      "안녕? 난 너에게 경제적으로 도움을 주고 싶은 OO(이)야",
      "전화 번호만 알려줄래?",
      "안녕 #1#, 반갑다",
      "아직 개발자가 날 개발 중이야 우리 곧 만나자!"
    ]
    this.exceptionDescArray = [
      "안녕, 근데 개발자가 아직 널 모르네.. 개발자랑 일단 친해지고 다시 만나자!",
    ]
    this.registeredNumber = {
      "1053690469": "승현",
      "1047965159": "상혁",
      "1072795036": "태웅",
      "1073737185": "정환",
      "1021709851": "지환",
      "1026232011": "진수",
      "1092471544": "은비",
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

    if(index <= 3 && index !== 1){
    this.descIndex = this.descIndex + 1
    this.presentDesc = this.descArray[this.descIndex]
    
    if(this.descIndex === 1) {clearInterval(this.interval); this.interval = undefined}
    
    } else if(index > 3){
      console.log("setAutoGuide called index > 3:: " + index);
      clearInterval(this.interval)
      clearTimeout(this.timeout)
    }
  }

  onSubmit(value: any): void {
    console.warn('input::: ' + JSON.stringify(this.numform.value));
    this.checkFriends(value)
  }

  private checkFriends(value: any) {
    console.log("checkFriends called :: " + value.number);

    for (let key in this.registeredNumber) {
      if(key === String(value.number)) {
        console.log("MATCH!! :: " + this.registeredNumber[key]);
        this.descArray[2] = this.descArray[2].replace('#1#', this.registeredNumber[key])
        this.setAutoGuide(this.descIndex+1)
      }
  }
  }
}
