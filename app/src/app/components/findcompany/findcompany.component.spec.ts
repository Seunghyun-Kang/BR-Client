import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindcompanyComponent } from './findcompany.component';

describe('FindcompanyComponent', () => {
  let component: FindcompanyComponent;
  let fixture: ComponentFixture<FindcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindcompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
