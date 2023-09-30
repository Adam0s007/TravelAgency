import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTripComponent } from './rate-trip.component';

describe('RateTripComponent', () => {
  let component: RateTripComponent;
  let fixture: ComponentFixture<RateTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
