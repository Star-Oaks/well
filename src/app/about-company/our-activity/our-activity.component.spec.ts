import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurActivityComponent } from './our-activity.component';

describe('OurActivityComponent', () => {
  let component: OurActivityComponent;
  let fixture: ComponentFixture<OurActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
