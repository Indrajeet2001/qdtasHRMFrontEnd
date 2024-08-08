import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpStatusComponent } from './add-emp-status.component';

describe('AddEmpStatusComponent', () => {
  let component: AddEmpStatusComponent;
  let fixture: ComponentFixture<AddEmpStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmpStatusComponent]
    });
    fixture = TestBed.createComponent(AddEmpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
