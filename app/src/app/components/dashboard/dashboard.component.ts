import { Component, OnInit } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public screenId = "dashboard"
  constructor(private service: PagestatusService) { 
    this.service.setStatus("dashboard")
    console.log("Version:: v3")
  }

  ngOnInit(): void {
  }

}
