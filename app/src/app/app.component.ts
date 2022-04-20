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
    this.iconSerivce.addSvgIcon('OptPortfolio','../assets/iamge/percent-black.svg' , 'user-icons')
    this.iconSerivce.addSvgIcon('StockDetails', '../assets/iamge/chart-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Dashboard', '../assets/iamge/home2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Rocket', '../assets/iamge/rocket2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Back', '../assets/iamge/back-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('List', '../assets/iamge/list2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Close', '../assets/iamge/close-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Question', '../assets/iamge/question2-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Menu', '../assets/iamge/menu-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('QuestionLeft', '../assets/iamge/question-left-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('LatestSignal', '../assets/iamge/filter-list-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Globe', '../assets/iamge/globe-black.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('Korea', '../assets/iamge/korea.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('USA', '../assets/iamge/usa.svg', 'user-icons')
    this.iconSerivce.addSvgIcon('COIN', '../assets/iamge/bitcoin (1).svg', 'user-icons')
  }
}
