import { Component, OnInit ,Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public columnNum: number = 0
  public columnArray: string[] = []
  public rowArray: Array<string[]> = []
  public title: string = ""

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: {title: string, column: string[], data: Array<string[]>},
  private router: Router,
  private dialogRef: MatDialog) { 

  }
  
  ngOnInit(): void {
    this.columnArray = this.data.column
    this.rowArray = this.data.data
    this.title = this.data.title
    this.columnNum = this.data.column.length
  }

  onTapCompany(code: string, company: string) {
    this.dialogRef.closeAll()
    this.router.navigate(['stockdetail'], {
      skipLocationChange: true,
      queryParams: {
        code: code,
        companyName: company
      }
    })
  }

}
