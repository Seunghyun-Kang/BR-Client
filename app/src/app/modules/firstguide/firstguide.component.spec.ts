import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstguideComponent } from './firstguide.component';

describe('FirstguideComponent', () => {
  let component: FirstguideComponent;
  let fixture: ComponentFixture<FirstguideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstguideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
