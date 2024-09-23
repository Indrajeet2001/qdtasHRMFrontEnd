import { Component } from '@angular/core';
import { DepartmentService } from '../service/departmentServices';
import { UserService } from '../service/userServices';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../model/user';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css'],
})
export class RecruitmentComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  jobTitle: any;
  departments: any;
  selectedManagers = [];
  fullName: any[] = [];
  selectedTeams = [];
  minDate: Date;
  startDate!: Date;
  resultSizeForUser = 1000;
  private subscriptions: Subscription[] = [];
  users: User[] = [];
  u!: User;

  isSidebarExpanded: boolean = true;

  constructor(private userService: UserService) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.minDate = currentDate;
  }

  ngOnInit(): void {
    this.getJobs();
    const currentPage = 1;
    this.loadUsers(currentPage);
  }

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  dropdownSettingsForManagers = {
    singleSelection: false,
    idField: 'id',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  getJobs() {
    this.userService.getAllJobTitle().subscribe((data) => {
      this.jobTitle = data;
      console.table(this.jobTitle);
    });
  }

  onDropdownFocusout(teams: NgModel) {
    if (this.selectedTeams.length === 0) {
      teams.control.markAsTouched();
    }
  }

  loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
  }

  loadUsernames(selectedPage: number): void {
    this.subscriptions.push(
      this.userService
        .getAllUsers(selectedPage, this.resultSizeForUser)
        .subscribe(
          (users: User[]) => {
            this.users = users;
            this.fullName = this.users
              .map((user) => user.firstName + ' ' + user.lastName)
              .filter((name) => !!name);
          },
          (error) => {
            console.log(error.error.message);
          }
        )
    );
  }
}
