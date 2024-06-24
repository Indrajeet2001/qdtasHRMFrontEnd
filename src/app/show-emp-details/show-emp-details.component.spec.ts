import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmpDetailsComponent } from './show-emp-details.component';

describe('ShowEmpDetailsComponent', () => {
  let component: ShowEmpDetailsComponent;
  let fixture: ComponentFixture<ShowEmpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowEmpDetailsComponent]
    });
    fixture = TestBed.createComponent(ShowEmpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
