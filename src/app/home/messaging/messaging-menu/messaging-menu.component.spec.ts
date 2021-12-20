import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingMenuComponent } from './messaging-menu.component';

describe('MessagingMenuComponent', () => {
  let component: MessagingMenuComponent;
  let fixture: ComponentFixture<MessagingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagingMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
