import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobtitleComponent } from './edit-jobtitle.component';

describe('EditJobtitleComponent', () => {
  let component: EditJobtitleComponent;
  let fixture: ComponentFixture<EditJobtitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditJobtitleComponent]
    });
    fixture = TestBed.createComponent(EditJobtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
