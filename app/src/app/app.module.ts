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

PlotlyModule.plotlyjs = PlotlyJS;

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stockdetail', component: StockdetailComponent },
  {path : '', redirectTo : '/dashboard',  pathMatch : 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IntroComponent,
    FirstguideComponent,
    DashboardComponent,
    StockdetailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing:false, useHash: true}
    ),
    AppRoutingModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlotlyModule
  ],
  providers: [HTMLCanvasElement],
  bootstrap: [AppComponent]
})
export class AppModule { }
