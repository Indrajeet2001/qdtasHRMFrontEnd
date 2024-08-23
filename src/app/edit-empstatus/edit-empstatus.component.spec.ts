import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpstatusComponent } from './edit-empstatus.component';

describe('EditEmpstatusComponent', () => {
  let component: EditEmpstatusComponent;
  let fixture: ComponentFixture<EditEmpstatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmpstatusComponent]
    });
    fixture = TestBed.createComponent(EditEmpstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
