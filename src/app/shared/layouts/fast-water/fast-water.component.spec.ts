import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastWaterComponent } from './fast-water.component';

describe('FastWaterComponent', () => {
  let component: FastWaterComponent;
  let fixture: ComponentFixture<FastWaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastWaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
