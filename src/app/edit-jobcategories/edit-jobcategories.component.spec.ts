import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobcategoriesComponent } from './edit-jobcategories.component';

describe('EditJobcategoriesComponent', () => {
  let component: EditJobcategoriesComponent;
  let fixture: ComponentFixture<EditJobcategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditJobcategoriesComponent]
    });
    fixture = TestBed.createComponent(EditJobcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
