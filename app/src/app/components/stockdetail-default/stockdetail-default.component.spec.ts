import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockdetailDefaultComponent } from './stockdetail-default.component';

describe('StockdetailDefaultComponent', () => {
  let component: StockdetailDefaultComponent;
  let fixture: ComponentFixture<StockdetailDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockdetailDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockdetailDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
