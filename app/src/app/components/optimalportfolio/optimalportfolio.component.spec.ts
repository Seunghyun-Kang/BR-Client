import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimalportfolioComponent } from './optimalportfolio.component';

describe('OptimalportfolioComponent', () => {
  let component: OptimalportfolioComponent;
  let fixture: ComponentFixture<OptimalportfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptimalportfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimalportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
