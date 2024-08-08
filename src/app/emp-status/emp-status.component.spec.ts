import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpStatusComponent } from './emp-status.component';

describe('EmpStatusComponent', () => {
  let component: EmpStatusComponent;
  let fixture: ComponentFixture<EmpStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpStatusComponent]
    });
    fixture = TestBed.createComponent(EmpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
