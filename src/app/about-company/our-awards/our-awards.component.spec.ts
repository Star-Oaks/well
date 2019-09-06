import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurAwardsComponent } from './our-awards.component';

describe('OurAwardsComponent', () => {
  let component: OurAwardsComponent;
  let fixture: ComponentFixture<OurAwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurAwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
