import { TestBed } from '@angular/core/testing';

import { ProvisionService } from './provision.service';

describe('ProvisionService', () => {
  let service: ProvisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
