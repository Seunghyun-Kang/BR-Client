import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockdstailBollingertrendComponent } from './stockdetail-bollingertrend.component';

describe('StockdstailBollingertrendComponent', () => {
  let component: StockdstailBollingertrendComponent;
  let fixture: ComponentFixture<StockdstailBollingertrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockdstailBollingertrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockdstailBollingertrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
