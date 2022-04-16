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
    this.list.itemClicked.subscribe((args: IListItemClickEventArgs) => {
        this.currentIndex = args.item.index;
        this.carousel.select(this.carousel.get(this.currentIndex));
    });

    this.carousel.onSlideChanged.subscribe((args: ISlideEventArgs) => {
        this.currentIndex = args.slide.index;
        (<HTMLElement>this.eRef.nativeElement).querySelector('.selected').scrollTo()
    });
  }

  ngAfterViewInit() {
  }

  public slideStyle(image: string) {
    return  {
        background: `url(${image})`,
        backgroundSize: 'cover'
    };
  }

  onSwipeRight(event: any) {
    this.carousel.prev();
  }
  onSwipeLeft(event: any) {
    this.carousel.next();
  }
}
