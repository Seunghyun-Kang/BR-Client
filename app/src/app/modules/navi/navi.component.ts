import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
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
    if(!IS_MOBILE) return
    if(this.eRef.nativeElement.contains(event.target)) {
      console.log("clicked inside")
    } else {
      this.onCloseMenu()
    }
  }

  @ViewChild(IgxNavigationDrawerComponent, { static: true })
  
  public drawer: IgxNavigationDrawerComponent;
  public navItems = [
    { name: 'Dashboard', text: '대쉬보드', family: 'user-icons' },
    { name: 'OptPortfolio', text: '종목 검색', family: 'user-icons' },
    { name: 'StockDetails', text: '최적 포트폴리오', family: 'user-icons' }
  ];
  private isOpenMenu: number = 0
  public selected = '';
  public minWidth = IS_MOBILE ? "50px" : "70px"
  public width = IS_MOBILE ? "190px" : "300px"

  public isGalaxyOn: boolean = true

  constructor(private router: Router,
    private statusService: PagestatusService,
    private eRef: ElementRef,
    ) { }

  ngOnInit(): void {
    this.isGalaxyOn = this.statusService.isGalaxyOn()
  }

  public navigate(item) {
    console.log(IS_MOBILE)
    console.log(this.isOpenMenu)
    if (this.isOpenMenu == 0) return
    if (IS_MOBILE && this.isOpenMenu == 2) return

    this.selected = item.text;

    switch (item.text) {
      case '종목 검색':
        this.onPressGetStock()
        break;
      case '최적 포트폴리오':
        this.onPressOptPortfolio()
        break;
      case '대쉬보드':
        this.onPressDashboard()
        break;
      default:
        break;
    }
  }

  onPressGetStock() {
    this.router.navigate(['findcompany'], {
      queryParams: {
        target: 'GetStockDetails'
      }
    })
  }

  onPressOptPortfolio() {
    this.router.navigate(['findcompany'], {
      queryParams: {
        target: 'OptPortfolio'
      }
    })
  }

  onPressDashboard() {
    this.router.navigate(['dashboard'])
  }

  onOpenMenu() {
    console.log("OPEN" + this.isOpenMenu)
    this.isOpenMenu++
    if (this.isOpenMenu > 1) return
    this.drawer.toggle()
  }
  
  onCloseMenu() {
    console.log("CLOSE")
    if (this.isOpenMenu == 0) return
    this.drawer.close()
    this.isOpenMenu = 0
  }

  onSwitchChanged(event: any) {
    console.log(event)
    switch (event.checked) {
      case true:
        this.statusService.setStatus("GalaxyOn")
        this.isGalaxyOn = true
        break;
      case false:
        this.statusService.setStatus("GalaxyOff")
        this.isGalaxyOn = false
        break;
    }
  }
}
