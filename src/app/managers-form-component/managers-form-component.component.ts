import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { NgModel } from '@angular/forms';
import { UserService } from '../service/userServices';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-managers-form-component',
  templateUrl: './managers-form-component.component.html',
  styleUrls: ['./managers-form-component.component.css'],
})
export class ManagersFormComponentComponent implements OnInit {
  isSidebarExpanded: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn!: User;

  managersList: any[] = [];
  selectedTeams = [];
  fullName: any[] = [];
  response: any;
  private subscriptions: Subscription[] = [];
  resultSizeForUser = 1000;
  users: User[] = [];
  projectId!: any;
  managerIds: number[] = [];
  selectedManagerIds: any[] = [];
  areAllManagersSelected: boolean = false;

  constructor(
    private UserService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    const currentPage = 1;
    this.loadUsernames(currentPage);
    this.subscriptions.push(
      this.UserService.getAllUsers(
        currentPage,
        this.resultSizeForUser
      ).subscribe(
        (users: User[]) => {
        },
        (error) => {
        }
      )
    );
  }

  getPath() {
    this.projectId = this.location.path().split('/')[2];
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
        },
        (error) => {
        }
      )
    );
  }

  loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
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

  assignManagers(): void {
    if (!this.projectId) {
      this.errorMessage = 'Project ID is required.';
      return;
    }
    if (!this.selectedManagerIds || this.selectedManagerIds.length === 0) {
      this.errorMessage = 'At least one manager must be selected.';
      return;
    }
    const payload = {
      projectId: this.projectId,
      managerIds: this.selectedManagerIds,
    };
    this.UserService.assignAllManagers(
      this.projectId,
      this.selectedManagerIds
    ).subscribe(
      (data) => {
        this.successMessage = 'Managers assigned successfully!';
        setTimeout(() => {
          this.router.navigate(['/project']);
        }, 2000);
      },
      (error) => {
        this.errorMessage =
          error.error?.message || 'Failed to assign managers.';
      }
    );
  }


  onSelectAllManagers(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.areAllManagersSelected = isChecked;

    if (isChecked) {
      this.selectedManagerIds = this.managersList.map(
        (manager) => manager.userId
      );
    } else {
      this.selectedManagerIds = [];
    }

  }

  onManagerSelection(event: Event, managerId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedManagerIds.push(managerId);
    } else {
      this.selectedManagerIds = this.selectedManagerIds.filter(
        (id) => id !== managerId
      );
    }

    this.areAllManagersSelected =
      this.selectedManagerIds.length === this.managersList.length;

  }
}
