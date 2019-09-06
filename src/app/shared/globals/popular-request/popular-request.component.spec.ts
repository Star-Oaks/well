import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularRequestComponent } from './popular-request.component';

describe('PopularRequestComponent', () => {
  let component: PopularRequestComponent;
  let fixture: ComponentFixture<PopularRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
