import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { NgModel } from '@angular/forms';
import { UserService } from '../service/userServices';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-teams-form-component',
  templateUrl: './teams-form-component.component.html',
  styleUrls: ['./teams-form-component.component.css'],
})
export class TeamsFormComponentComponent implements OnInit {
  isSidebarExpanded: boolean = true;
  selectedEmployeeIds: string[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn!: User;
  selectedManagers = [];
  managersList: any[] = [];
  selectedTeams = [];
  fullName: any[] = [];
  projectId!: any;
  private subscriptions: Subscription[] = [];
  resultSizeForUser = 1000;
  users: User[] = [];
  userIds: any[] = [];
  selectedUserIds: any[] = [];
  areAllUsersSelected: boolean = false;

  constructor(
    private UserService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    const currentPage = 1;
    this.loadUsers(currentPage);
  }

  onDropdownFocusout(teams: NgModel) {
    if (this.selectedTeams.length === 0) {
      teams.control.markAsTouched();
    }
  }

  loadUsernames(selectedPage: number): void {
    this.subscriptions.push(
      this.UserService.getAllUsers(
        selectedPage,
        this.resultSizeForUser
      ).subscribe(
        (users: User[]) => {
          this.users = users;
          this.fullName = this.users
            .map((user) => user.firstName + ' ' + user.lastName)
            .filter((name) => !!name);
          this.managersList = this.users
            .filter((user) => user.subRole === 'ROLE_MANAGER')
            .map((manager) => ({
              name: manager.firstName + ' ' + manager.lastName,
              userId: manager.userId,
            }));
          this.userIds = this.users.map((user) => user.userId);
        },
        (error) => {
        }
      )
    );
  }

  loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
  }

  getPath() {
    this.projectId = this.location.path().split('/')[2];
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  assignEmploye(): void {
    if (!this.projectId) {
      this.errorMessage = 'Project ID is required.';
      return;
    }
    if (!this.selectedUserIds || this.selectedUserIds.length === 0) {
      this.errorMessage = 'At least one employee must be selected.';
      return;
    }
    const payload = {
      projectId: this.projectId,
      userIds: this.selectedUserIds,
    };
    this.UserService.assignAllEmployee(
      this.projectId,
      this.selectedUserIds
    ).subscribe(
      (data) => {
        this.successMessage = 'Employee assigned successfully!';
        setTimeout(() => {
          this.router.navigate(['/project']);
        }, 2000);
      },
      (error) => {
        this.errorMessage =
          error.error?.message || 'Failed to assign employee.';
      }
    );
  }

  onSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.areAllUsersSelected = isChecked;

    if (isChecked) {
      this.selectedUserIds = this.users.map((user) => user.userId);
    } else {
      this.selectedUserIds = [];
    }

  }

  onUserSelection(event: Event, userId: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedUserIds.push(userId);
    } else {
      this.selectedUserIds = this.selectedUserIds.filter((id) => id !== userId);
    }

    this.areAllUsersSelected =
      this.selectedUserIds.length === this.users.length;

  }
}
