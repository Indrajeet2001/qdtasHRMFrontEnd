import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkshiftsComponent } from './edit-workshifts.component';

describe('EditWorkshiftsComponent', () => {
  let component: EditWorkshiftsComponent;
  let fixture: ComponentFixture<EditWorkshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWorkshiftsComponent]
    });
    fixture = TestBed.createComponent(EditWorkshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
