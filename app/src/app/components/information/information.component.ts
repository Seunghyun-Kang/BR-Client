import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @ViewChild('group') group;

  public btnElement: Element;
  public selectedIndex = 0
  private itemLen = 3
  ElByClassName: any;
  constructor() { }

  ngOnInit(): void {
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
}

  onSwipeRight(event: any) {
    console.log("RIGHT")
    if(this.selectedIndex !== 0) {this.selectedIndex = this.selectedIndex - 1;this.group.focusTab(this.selectedIndex )}
 
  }
  onSwipeLeft(event: any) {
    console.log("Left")
    if(this.selectedIndex !== this.itemLen-1) {this.selectedIndex = this.selectedIndex + 1
    this.group.focusTab(this.selectedIndex )
    }
  }
}
