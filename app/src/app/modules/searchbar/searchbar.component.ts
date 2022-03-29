import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators'; 
import {Observable} from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { companyData } from 'src/app/components/findcompany/findcompany.component';

@Component({
    selector: 'app-search-bar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.scss']
})
export class SearchBarComponent implements OnInit {

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    allData: string[] = [];
    filterCompany: Observable<string[]>;
    select: Array<string> = []
    autoCompleteList: any[]

    @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
    @Output() onSelectedOption = new EventEmitter();

    constructor(
        public dataService: DataService
    ) { }

    ngOnInit() {
        let data: companyData[] = this.dataService.getCompanyData()
        data.forEach((element: companyData) => {
            this.allData.push(element.company)
        });
        
        // when user types something in input, the value changes will come through this
        this.myControl.valueChanges.subscribe(userInput => {
            this.autoCompleteExpenseList(userInput);
        })
      }
    
    private autoCompleteExpenseList(input: any) {
        let categoryList = this.filterCategoryList(input)
        this.autoCompleteList = categoryList;
    }

    // this is where filtering the data happens according to you typed value
    filterCategoryList(val: any) {
        var categoryList = []
        if (typeof val != "string") {
            return [];
        }
        if (val === '' || val === null) {
            return [];
        }
        return val ? this.allData.filter((s: any) => s.indexOf(val) !== -1) : this.allData;
    }

    // after you clicked an autosuggest option, this function will show the field you want to show in input
    displayFn(post: any) {
        return post;
    }

    filterPostList(event: any) {
        var posts = event.source.value;
        console.log(posts)
        this.select.push(posts)
        this.onSelectedOption.emit(this.select)
        this.focusOnPlaceInput();
    }

    removeOption(option: any) {
        console.log("removeOption ::" + option)

        let index = this.select.indexOf(option);
        if (index >= 0)
        this.select.splice(index, 1);
        this.focusOnPlaceInput();

        this.onSelectedOption.emit(this.select)
    }

    // focus the input field and remove any unwanted text.
    focusOnPlaceInput() {
        this.autocompleteInput.nativeElement.focus();
        this.autocompleteInput.nativeElement.value = '';
    }
}