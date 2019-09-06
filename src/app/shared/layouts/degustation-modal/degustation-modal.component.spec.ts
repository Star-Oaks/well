import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustationModalComponent } from './degustation-modal.component';

describe('DegustationModalComponent', () => {
  let component: DegustationModalComponent;
  let fixture: ComponentFixture<DegustationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DegustationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegustationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
