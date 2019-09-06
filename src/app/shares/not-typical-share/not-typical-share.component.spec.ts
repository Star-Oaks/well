import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotTypicalShareComponent } from './not-typical-share.component';

describe('NotTypicalShareComponent', () => {
  let component: NotTypicalShareComponent;
  let fixture: ComponentFixture<NotTypicalShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotTypicalShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotTypicalShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
