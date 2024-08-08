import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobCategoriesComponent } from './add-job-categories.component';

describe('AddJobCategoriesComponent', () => {
  let component: AddJobCategoriesComponent;
  let fixture: ComponentFixture<AddJobCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddJobCategoriesComponent]
    });
    fixture = TestBed.createComponent(AddJobCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
