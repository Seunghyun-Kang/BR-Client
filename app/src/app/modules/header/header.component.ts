import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { PagestatusService } from 'src/app/services/pagestatus.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = ""
  public status: string = ""
  constructor(private location: Location, private service: PagestatusService) { }

  ngOnInit(): void {
    this.service.getStatus().subscribe((value: any) => {
      this.status = value;
    });
  }

  onPressBack() {
    this.location.back();
  }

}
