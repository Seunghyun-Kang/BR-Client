import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockdstailTriplescreenComponent } from './stockdstail-triplescreen.component';

describe('StockdstailTriplescreenComponent', () => {
  let component: StockdstailTriplescreenComponent;
  let fixture: ComponentFixture<StockdstailTriplescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockdstailTriplescreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockdstailTriplescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
