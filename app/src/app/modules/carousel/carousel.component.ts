import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() inputs: any[] = []
  @ViewChild(NgbCarousel) carousel;
  
  constructor() {
  }

  ngOnInit(): void {
  }

  onSwipeRight() {
    this.carousel.prev();
  }
  onSwipeLeft() {
    this.carousel.next();
  }
}
