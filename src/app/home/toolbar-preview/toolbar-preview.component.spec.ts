import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarPreviewComponent } from './toolbar-preview.component';

describe('ToolbarPreviewComponent', () => {
  let component: ToolbarPreviewComponent;
  let fixture: ComponentFixture<ToolbarPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
