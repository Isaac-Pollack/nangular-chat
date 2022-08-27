import { TestBed } from '@angular/core/testing';

import { JsonDataManagementService } from './json-data-management.service';

describe('JsonDataManagementService', () => {
  let service: JsonDataManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonDataManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
