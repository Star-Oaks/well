import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryWaterComponent } from './delivery-water.component';

describe('DeliveryWaterComponent', () => {
  let component: DeliveryWaterComponent;
  let fixture: ComponentFixture<DeliveryWaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryWaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
