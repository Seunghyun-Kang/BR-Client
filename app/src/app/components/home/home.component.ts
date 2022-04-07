import { Component, Inject, OnInit } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public screenId = "home"
  constructor(private service: PagestatusService,
    @Inject("Version") public appVersion: string, ) {
    this.service.setStatus("dashboard")
    console.log("Version:: " + appVersion)
  }

  ngOnInit(): void {
  }

}
