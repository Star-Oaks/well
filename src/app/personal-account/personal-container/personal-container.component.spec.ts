import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContainerComponent } from './personal-container.component';

describe('PersonalContainerComponent', () => {
  let component: PersonalContainerComponent;
  let fixture: ComponentFixture<PersonalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
