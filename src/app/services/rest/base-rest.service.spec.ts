import { TestBed } from '@angular/core/testing';

import { BaseRestService } from './base-rest.service';

describe('BaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseRestService = TestBed.get(BaseRestService);
    expect(service).toBeTruthy();
  });
});
