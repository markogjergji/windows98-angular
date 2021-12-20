import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocallingComponent } from './videocalling.component';

describe('VideocallingComponent', () => {
  let component: VideocallingComponent;
  let fixture: ComponentFixture<VideocallingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideocallingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideocallingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
