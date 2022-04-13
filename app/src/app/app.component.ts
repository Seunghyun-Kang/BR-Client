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
    this.iconSerivce.addSvgIcon('OptPortfolio','../assets/iamge/document-color.svg' , 'user-icons')
    this.iconSerivce.addSvgIcon('StockDetails', '../assets/iamge/chart-color.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Dashboard', '../assets/iamge/homepage-color.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Rocket', '../assets/iamge/rocket-color.svg', 'user-icons')
  }
}
