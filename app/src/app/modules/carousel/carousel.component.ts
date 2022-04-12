import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() inputs: any[] = []
  @Input() speed: number = 5000
  @ViewChild(NgbCarousel) carousel;
  
  constructor() {
  }

  ngOnInit(): void {
  }

  onSwipeRight(event: any) {
    this.carousel.prev();
  }
  onSwipeLeft(event: any) {
    this.carousel.next();
  }
}
