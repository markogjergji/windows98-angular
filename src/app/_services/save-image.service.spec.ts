import { TestBed } from '@angular/core/testing';

import { SaveImageService } from './save-image.service';

describe('SaveImageService', () => {
  let service: SaveImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
