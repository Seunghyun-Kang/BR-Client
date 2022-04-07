import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockdstailBollingerreverseComponent } from './stockdstail-bollingerreverse.component';

describe('StockdstailBollingerreverseComponent', () => {
  let component: StockdstailBollingerreverseComponent;
  let fixture: ComponentFixture<StockdstailBollingerreverseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockdstailBollingerreverseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockdstailBollingerreverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
