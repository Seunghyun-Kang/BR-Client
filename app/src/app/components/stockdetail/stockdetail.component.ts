import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.scss']
})

export class StockdetailComponent implements OnInit {
  public code: string
  public companyName: string

  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
          this.code = params['code']
      });

      console.log('StockdetailComponent Constructor, code is ::' + this.code);
  }

  ngOnInit(): void {
    this.requestService.getCompanyName(this.code) 
    .subscribe({
        next: (v) => console.log("RESONSE FROM SERVER :: " + JSON.stringify(v)),
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });

    this.requestService.getPrices(this.code) 
    .subscribe({
        next: (v) => console.log("RESONSE FROM SERVER :: " + JSON.stringify(v)),
        error: (e) => console.log("ERROR OCCURED :: " + JSON.stringify(e))
      });
  }

}
