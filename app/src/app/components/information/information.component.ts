import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { PagestatusService } from 'src/app/services/pagestatus.service';

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
  public type: string
  private subscription : Subscription;

  ElByClassName: any;
  constructor(private statusService: PagestatusService,) { }

  ngOnInit(): void {
    this.subscription = this.statusService.getType().subscribe((value) => {
      console.log("TYPE ::" + value);
      this.type = value
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
}

ngOnDestroy(): void {
  console.log("ngOnDestroy")
  this.subscription.unsubscribe()
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
