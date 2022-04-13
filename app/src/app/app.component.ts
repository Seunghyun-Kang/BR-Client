import { Component } from '@angular/core';
import { IgxIconService } from 'igniteui-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  
  constructor(private iconSerivce: IgxIconService){
    this.iconSerivce.addSvgIcon('OptPortfolio','../assets/iamge/document-black.svg' , 'user-icons')
    this.iconSerivce.addSvgIcon('StockDetails', '../assets/iamge/chart-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Dashboard', '../assets/iamge/homepage-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Rocket', '../assets/iamge/rocket2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Back', '../assets/iamge/back-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('List', '../assets/iamge/list2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Close', '../assets/iamge/close-black.svg', 'user-icons')
  }
}
