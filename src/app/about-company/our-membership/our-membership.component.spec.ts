import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurMembershipComponent } from './our-membership.component';

describe('OurMembershipComponent', () => {
  let component: OurMembershipComponent;
  let fixture: ComponentFixture<OurMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
