import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { IgxCarouselComponent, IgxListComponent, IListItemClickEventArgs, ISlideEventArgs } from 'igniteui-angular';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() inputs: any[] = []
  @Input() speed: number = IS_MOBILE? 0: 2000
  // @ViewChild(NgbCarousel) carousel;
  public mobile = IS_MOBILE
  @ViewChild(IgxCarouselComponent, { static: true })
  public carousel: IgxCarouselComponent;

  @ViewChild(IgxListComponent, {static: true})
  public list: IgxListComponent;

  public currentIndex = 0;
  
  constructor(private eRef: ElementRef,
    ) {
  }

  ngOnInit(): void {
    // this.addSlides();
    this.inputs.forEach(element => {
   if(Number(element[4]) > 0 ) element[4] = 'red'
   else element[4] = 'blue'
 });
  }

  ngAfterViewInit() {
  }

  onSwipeRight(event: any) {
    this.carousel.prev();
  }
  onSwipeLeft(event: any) {
    this.carousel.next();
  }
}
