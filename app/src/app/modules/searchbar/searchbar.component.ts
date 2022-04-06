import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.scss']
})
export class SearchBarComponent implements OnInit {

    @Input() autoCompleteList: any[] =[]
    @Input() placeholder: string = ""
    @Input() inputType: string = "text"
    @Input() patternType: string = ""

    myControl = new FormControl();
    select: Array<string> = []
    public list: any[] = []
    public inputList: any

    @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
    @Output() onSelectedOption = new EventEmitter();

    constructor(
        public dataService: DataService
    ) {
     }

    ngOnInit() {
        // when user types something in input, the value changes will come through this
        this.myControl.valueChanges.subscribe(userInput => {
            this.autoCompleteExpenseList(userInput);
        })
      }
    
    private autoCompleteExpenseList(input: any) {
        let categoryList = this.filterCategoryList(input)
        this.list = categoryList;
        this.inputList = input
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
        return val ? this.autoCompleteList.filter((s: any) => s.toLowerCase().indexOf(val.toLowerCase()) !== -1) : this.autoCompleteList;
    }

    // after you clicked an autosuggest option, this function will show the field you want to show in input
    displayFn(post: any) {
        return post;
    }

    filterPostList(event: any) {
        var posts: any
        if(event.source !== undefined && event.source.value !== undefined) 
            posts = event.source.value;
        else
            posts = event

        console.log(posts)
        this.select.push(posts)
        this.onSelectedOption.emit(this.select)
        this.focusOnPlaceInput();
        this.list = []
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