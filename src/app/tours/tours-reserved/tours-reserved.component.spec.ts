import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursReservedComponent } from './tours-reserved.component';

describe('ToursReservedComponent', () => {
  let component: ToursReservedComponent;
  let fixture: ComponentFixture<ToursReservedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToursReservedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToursReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
