import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';

import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IntroComponent } from './modules/intro/intro.component';
import { FirstguideComponent } from './modules/firstguide/firstguide.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { StockdetailComponent } from './components/stockdetail/stockdetail.component';
import { HttpClientModule } from '@angular/common/http';
import Hammer from 'hammerjs';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { FindcompanyComponent } from './components/findcompany/findcompany.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from './modules/searchbar/searchbar.component';
import { GuideComponent } from './modules/guide/guide.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OptimalportfolioComponent } from './components/optimalportfolio/optimalportfolio.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StockdstailBollingertrendComponent } from './components/stockdetail-bollingertrend/stockdetail-bollingertrend.component';
import { StockdstailBollingerreverseComponent } from './components/stockdstail-bollingerreverse/stockdstail-bollingerreverse.component';
import { StockdstailTriplescreenComponent } from './components/stockdstail-triplescreen/stockdstail-triplescreen.component';
import { StockdetailDefaultComponent } from './components/stockdetail-default/stockdetail-default.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './modules/carousel/carousel.component';
import { IgxButtonModule, IgxIconModule, IgxNavigationDrawerModule, IgxSwitchModule } from 'igniteui-angular';
import { NaviComponent } from './modules/navi/navi.component';
import { ListComponent } from './modules/list/list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table' 
import {MatButtonModule} from '@angular/material/button';
import { InformationComponent } from './components/information/information.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { 
	IgxCarouselModule,
  IgxListModule,
	IgxToastModule
 } from "igniteui-angular";
import { LatestsignalComponent } from './components/latestsignal/latestsignal.component';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './services/auth.guard';
import { MomentumComponent } from './components/momentum/momentum.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatNativeDateModule} from '@angular/material/core';
import {DatePipe} from '@angular/common';


PlotlyModule.plotlyjs = PlotlyJS;
export class MyHammerConfig extends HammerGestureConfig  {
  override buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: "pan-y",
    });
    return mc;
  }
}

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', canActivate: [AuthGuard],
  children: [{ path: 'dashboard', component: DashboardComponent },
  { path: 'findcompany', component: FindcompanyComponent },
  { path: 'stockdetail', component: StockdetailComponent },
  { path: 'stockdetail-triplescreen', component: StockdstailTriplescreenComponent },
  { path: 'stockdetail-bollingertrend', component: StockdstailBollingertrendComponent },
  { path: 'stockdetail-bollingerreverse', component: StockdstailBollingerreverseComponent },
  { path: 'optimalportfolio', component: OptimalportfolioComponent },
  { path: 'information', component: InformationComponent },
  { path: 'latestsignal', component: LatestsignalComponent },
  { path: 'momentum', component: MomentumComponent },
]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IntroComponent,
    FirstguideComponent,
    HomeComponent,
    StockdetailComponent,
    FindcompanyComponent,
    SearchBarComponent,
    GuideComponent,
    HomeComponent,
    OptimalportfolioComponent,
    StockdstailBollingertrendComponent,
    StockdstailBollingerreverseComponent,
    StockdstailTriplescreenComponent,
    DashboardComponent,
    OptimalportfolioComponent,
    StockdetailDefaultComponent,
    CarouselComponent,
    NaviComponent,
    ListComponent,
    InformationComponent,
    LatestsignalComponent,
    MomentumComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false, useHash: true, scrollPositionRestoration: 'enabled' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlotlyModule,
    NgApexchartsModule,
    CommonModule,
    NgbModule,
    HammerModule,
    IgxNavigationDrawerModule, IgxIconModule, IgxSwitchModule, IgxButtonModule,
    MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule, MatDialogModule, MatTableModule, MatButtonModule,
    MatTabsModule, MatCardModule,MatBadgeModule, MatTooltipModule, MatSelectModule, MatMenuModule, MatRadioModule,MatDatepickerModule,MatNativeDateModule,
    IgxCarouselModule, IgxListModule, IgxToastModule
  ],
  providers: [
    HTMLCanvasElement,
    {
      provide: "Version",
      useValue: 'BR V32',
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    CookieService,
    MatDatepickerModule,
    DatePipe
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
