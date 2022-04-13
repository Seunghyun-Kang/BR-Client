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
import * as Hammer from 'hammerjs';
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
import { DeviceDetectorService } from 'ngx-device-detector';
import { StockdetailDefaultComponent } from './components/stockdetail-default/stockdetail-default.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './modules/carousel/carousel.component';
import { IgxButtonModule, IgxIconModule, IgxNavigationDrawerModule } from 'igniteui-angular';
import { NaviComponent } from './modules/navi/navi.component';

PlotlyModule.plotlyjs = PlotlyJS;
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'findcompany', component: FindcompanyComponent },
  { path: 'stockdetail', component: StockdetailComponent },
  { path: 'stockdetail-triplescreen', component: StockdstailTriplescreenComponent },
  { path: 'stockdetail-bollingertrend', component: StockdstailBollingertrendComponent },
  { path: 'stockdetail-bollingerreverse', component: StockdstailBollingerreverseComponent },
  { path: 'optimalportfolio', component: OptimalportfolioComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
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
    NaviComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false, useHash: true }),
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlotlyModule,
    NgApexchartsModule,
    CommonModule,
    NgbModule,
    IgxButtonModule,
    HammerModule,
    IgxNavigationDrawerModule,
    IgxIconModule
  ],
  providers: [HTMLCanvasElement,
    {
      provide: "Version",
      useValue: 'BR V13',
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    }],
  bootstrap: [AppComponent]
})

export class AppModule {
}
