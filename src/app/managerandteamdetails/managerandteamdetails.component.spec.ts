import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerandteamdetailsComponent } from './managerandteamdetails.component';

describe('ManagerandteamdetailsComponent', () => {
  let component: ManagerandteamdetailsComponent;
  let fixture: ComponentFixture<ManagerandteamdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerandteamdetailsComponent]
    });
    fixture = TestBed.createComponent(ManagerandteamdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
