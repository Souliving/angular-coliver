import { TestBed } from '@angular/core/testing';

import { FormsApiService } from './forms-api.service';

describe('FormsApiService', () => {
  let service: FormsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
