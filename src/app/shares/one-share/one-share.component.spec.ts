import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneShareComponent } from './one-share.component';

describe('OneShareComponent', () => {
  let component: OneShareComponent;
  let fixture: ComponentFixture<OneShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
