import { TestBed } from '@angular/core/testing';

import { SystemAdminGuard } from './system-admin.guard';

describe('SystemAdminGuard', () => {
  let guard: SystemAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SystemAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
