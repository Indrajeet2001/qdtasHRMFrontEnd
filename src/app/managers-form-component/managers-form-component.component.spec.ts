import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersFormComponentComponent } from './managers-form-component.component';

describe('ManagersFormComponentComponent', () => {
  let component: ManagersFormComponentComponent;
  let fixture: ComponentFixture<ManagersFormComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagersFormComponentComponent]
    });
    fixture = TestBed.createComponent(ManagersFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
