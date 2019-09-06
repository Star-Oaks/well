import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorsicoComponent } from './corsico.component';

describe('CorsicoComponent', () => {
  let component: CorsicoComponent;
  let fixture: ComponentFixture<CorsicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorsicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorsicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
