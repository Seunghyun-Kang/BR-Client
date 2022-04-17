import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestsignalComponent } from './latestsignal.component';

describe('LatestsignalComponent', () => {
  let component: LatestsignalComponent;
  let fixture: ComponentFixture<LatestsignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestsignalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestsignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
