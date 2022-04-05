import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { IntroComponent } from './modules/intro/intro.component';
import { FirstguideComponent } from './modules/firstguide/firstguide.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockdetailComponent } from './components/stockdetail/stockdetail.component';
import { HttpClientModule } from '@angular/common/http';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { FindcompanyComponent } from './components/findcompany/findcompany.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
import { SearchBarComponent } from './modules/searchbar/searchbar.component';
import { GuideComponent } from './modules/guide/guide.component';
import { MenuComponent } from './components/menu/menu.component';
import { OptimalportfolioComponent } from './components/optimalportfolio/optimalportfolio.component';
import { NgApexchartsModule } from 'ng-apexcharts';

PlotlyModule.plotlyjs = PlotlyJS;

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'findcompany', component: FindcompanyComponent },
  { path: 'stockdetail', component: StockdetailComponent },
  { path: 'optimalportfolio', component: OptimalportfolioComponent },
  {path : '', redirectTo : '/dashboard',  pathMatch : 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IntroComponent,
    FirstguideComponent,
    DashboardComponent,
    StockdetailComponent,
    FindcompanyComponent,
    SearchBarComponent,
    GuideComponent,
    MenuComponent,
    OptimalportfolioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatChipsModule, 
    MatFormFieldModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing:false, useHash: true}
    ),
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlotlyModule,
    NgApexchartsModule
  ],
  providers: [HTMLCanvasElement,
    {
      provide: "Version",
      useValue: 'BR V7',
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
