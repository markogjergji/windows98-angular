import { TestBed } from '@angular/core/testing';

import { RedirectToHomeGuard } from './redirect-to-home.guard';

describe('RedirectToHomeGuard', () => {
  let guard: RedirectToHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectToHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
