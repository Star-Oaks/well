import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorOrderComponent } from './error-order.component';

describe('ErrorOrderComponent', () => {
  let component: ErrorOrderComponent;
  let fixture: ComponentFixture<ErrorOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
