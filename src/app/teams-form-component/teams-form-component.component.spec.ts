import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsFormComponentComponent } from './teams-form-component.component';

describe('TeamsFormComponentComponent', () => {
  let component: TeamsFormComponentComponent;
  let fixture: ComponentFixture<TeamsFormComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamsFormComponentComponent]
    });
    fixture = TestBed.createComponent(TeamsFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
