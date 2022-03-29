import { TestBed } from '@angular/core/testing';

import { PagestatusService } from './pagestatus.service';

describe('PagestatusService', () => {
  let service: PagestatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagestatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
