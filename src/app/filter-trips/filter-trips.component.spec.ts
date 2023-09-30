import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTripsComponent } from './filter-trips.component';

describe('FilterTripsComponent', () => {
  let component: FilterTripsComponent;
  let fixture: ComponentFixture<FilterTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
