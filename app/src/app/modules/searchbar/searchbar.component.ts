import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.scss']
})
export class SearchBarComponent implements OnInit {

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    allData: any;
    autoCompleteList: any[]

    @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
    @Output() onSelectedOption = new EventEmitter();

    constructor(
        public dataService: DataService
    ) { }

    ngOnInit() {

        // get all the post
        this.allData = this.dataService.getCompanyData()

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
        return val ? this.allData.filter((s: any) => s.title.toLowerCase().indexOf(val.toLowerCase()) != -1)
            : this.allData;
    }

    // after you clicked an autosuggest option, this function will show the field you want to show in input
    displayFn(post: any) {
        let k = post ? post.title : post;
        return k;
    }

    filterPostList(event: any) {
        var posts = event.source.value;
        if (!posts) {
            this.dataService.searchOption = []
        }
        else {

            this.dataService.searchOption.push(posts);
            this.onSelectedOption.emit(this.dataService.searchOption)
        }
        this.focusOnPlaceInput();
    }

    removeOption(option: any) {

        let index = this.dataService.searchOption.indexOf(option);
        if (index >= 0)
            this.dataService.searchOption.splice(index, 1);
        this.focusOnPlaceInput();

        this.onSelectedOption.emit(this.dataService.searchOption)
    }

    // focus the input field and remove any unwanted text.
    focusOnPlaceInput() {
        this.autocompleteInput.nativeElement.focus();
        this.autocompleteInput.nativeElement.value = '';
    }


}