import { Component, OnInit, ViewChild, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { PagestatusService } from 'src/app/services/pagestatus.service';

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})

export class NaviComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if ((<HTMLElement>this.eRef.nativeElement).querySelector(
      '.igx-nav-drawer__aside'
    ).contains(event.target)) {
      this.isOpenMenu++;
    }
    if ((<HTMLElement>this.eRef.nativeElement).querySelector(
      '.igx-nav-drawer__overlay'
    ).contains(event.target)) {
      this.isOpenMenu = 0;
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    if ((<HTMLElement>this.eRef.nativeElement).querySelector(
      '.igx-nav-drawer__overlay'
    ).contains(event.target)) {
      this.drawer.close()

      this.isOpenMenu = 0;
    }
    if ((<HTMLElement>this.eRef.nativeElement).querySelector(
      '.igx-nav-drawer__aside'
    ).contains(event.target)) {
      this.drawer.open()
      this.renderer.setStyle((<HTMLElement>this.eRef.nativeElement).querySelector(
        '.igx-nav-drawer__overlay'
      ), "height", document.getElementById("body").offsetHeight + "px");
    }
  }

  @Input() page: string = ""
  @Input() overlayHeight: number = 0
  @ViewChild('.igx-nav-drawer__aside') drawerAside: ElementRef;
  @ViewChild('.igx-nav-drawer__overlay') autocompleteInput: ElementRef;
  @ViewChild(IgxNavigationDrawerComponent, { static: true })

  public drawer: IgxNavigationDrawerComponent;
  public navItems = [
    { name: 'Dashboard', text: '대쉬보드', family: 'user-icons' },
    { name: 'LatestSignal', text: '최근 신호', family: 'user-icons' },
    { name: 'StockDetails', text: '종목 검색', family: 'user-icons' },
    { name: 'OptPortfolio', text: '최적 포트폴리오', family: 'user-icons' },
    { name: 'Question', text: '기본 설명', family: 'user-icons' },
  ];
  private isOpenMenu: number = 0
  public selected = '';
  public minWidth = IS_MOBILE ? "50px" : "53px"
  public width = IS_MOBILE ? "190px" : "200px"
  public isGalaxyOn: boolean = true
  private onSwitch: boolean = false
  public switchGuide: string = ""

  constructor(private router: Router,
    private statusService: PagestatusService,
    private eRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.isGalaxyOn = this.statusService.isGalaxyOn()
    this.selected = this.page
  }
  ngAfterViewInit() {

  }
  public navigate(item) {
    this.selected = item.text;
    this.isOpenMenu = 0
    if (IS_MOBILE) this.drawer.close()

    switch (item.text) {
      case '종목 검색':
        this.onPressGetStock()
        break;
      case '최근 신호':
        this.onPressLatestSignal()
        break;
      case '최적 포트폴리오':
        this.onPressOptPortfolio()
        break;
      case '대쉬보드':
        this.onPressDashboard()
        break;
      case '기본 설명':
        this.onPressInformation()
        break;
      default:
        break;
    }
  }

  onPressGetStock() {
    this.router.navigate(['findcompany'], {
      skipLocationChange: true,
      queryParams: {
        target: 'GetStockDetails'
      }
    })
  }

  onPressOptPortfolio() {
    this.router.navigate(['findcompany'], {
      skipLocationChange: true,
      queryParams: {
        target: 'OptPortfolio'
      }
    })
  }

  onPressInformation() {
    this.router.navigate(['information'],{skipLocationChange: true})
  }

  onPressLatestSignal() {
    this.router.navigate(['latestsignal'],{skipLocationChange: true})
  }

  onPressDashboard() {
    this.router.navigate(['dashboard'],{skipLocationChange: true})
  }

  onOpenMenu() {
    console.log("OPEN")
    this.drawer.open()
  }

  onCloseMenu() {
    console.log("CLOSE")
    this.drawer.close()
  }

  onSwitchChanged(event: any) {
    console.log(event)
    switch (event.checked) {
      case true:
        this.statusService.setStatus("GalaxyOn")
        this.isGalaxyOn = true
        this.switchGuide = "우주 배경이 켜집니다."
        break;
      case false:
        this.statusService.setStatus("GalaxyOff")
        this.isGalaxyOn = false
        this.switchGuide = "우주 배경이 꺼집니다."
        break;
    }
  }
}
