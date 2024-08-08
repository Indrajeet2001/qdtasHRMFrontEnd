import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshiftsComponent } from './workshifts.component';

describe('WorkshiftsComponent', () => {
  let component: WorkshiftsComponent;
  let fixture: ComponentFixture<WorkshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshiftsComponent]
    });
    fixture = TestBed.createComponent(WorkshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
