import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSalesContractComponent } from './public-sales-contract.component';

describe('PublicSalesContractComponent', () => {
  let component: PublicSalesContractComponent;
  let fixture: ComponentFixture<PublicSalesContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicSalesContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSalesContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
