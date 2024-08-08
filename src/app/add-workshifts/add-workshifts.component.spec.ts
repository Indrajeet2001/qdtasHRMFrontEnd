import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkshiftsComponent } from './add-workshifts.component';

describe('AddWorkshiftsComponent', () => {
  let component: AddWorkshiftsComponent;
  let fixture: ComponentFixture<AddWorkshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkshiftsComponent]
    });
    fixture = TestBed.createComponent(AddWorkshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
