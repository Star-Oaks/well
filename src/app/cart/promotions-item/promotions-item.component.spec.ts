import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsItemComponent } from './promotions-item.component';

describe('PromotionsItemComponent', () => {
  let component: PromotionsItemComponent;
  let fixture: ComponentFixture<PromotionsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
