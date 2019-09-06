import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationsItemComponent } from './recommendations-item.component';

describe('RecommendationsItemComponent', () => {
  let component: RecommendationsItemComponent;
  let fixture: ComponentFixture<RecommendationsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
