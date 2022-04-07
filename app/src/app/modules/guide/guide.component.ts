import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit, OnDestroy {
  public presentDesc: string = ""
  private timeout: any
  private interval: any
  public descIndex = -1
  @Input() descArray: Array<string> = []
  @Input() exceptionDescArray: Array<string> = []
  @Input() position: string = ""
  @Output() indexChange = new EventEmitter();

  constructor() {
    this.descIndex = -1;
  }

  ngOnInit(): void {
    this.setAutoGuide(this.descIndex)
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  private setAutoGuide(index: number) {
    this.interval = setInterval(() => {
      this.presentDesc = this.descArray[++index]
      this.Changed(index)
      console.log(this.presentDesc)

      if (index >= this.descArray.length - 1) clearInterval(this.interval)
    }, 3000)
  }

  Changed(index: number) { // You can give any function name
    this.indexChange.emit(index);
  }
}

