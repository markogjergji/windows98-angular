import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingTextComponent } from './messaging-text.component';

describe('MessagingTextComponent', () => {
  let component: MessagingTextComponent;
  let fixture: ComponentFixture<MessagingTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagingTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
