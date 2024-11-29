import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/userServices';
import { Subscription } from 'rxjs';
import { Project } from '../model/project';
import { MatTableDataSource } from '@angular/material/table';
import { NgModel } from '@angular/forms';
import { ManagerandteamdetailsComponent } from '../managerandteamdetails/managerandteamdetails.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  isSidebarExpanded: boolean = true;
  users: User[] = [];
  u!: User;
  resultSizeForUser = 1000;
  resultSize = 10;
  resultPage: number = 1;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  noResultMessage: string = '';
  empId: number = this.UserService.getAuthUserId();
  eId: Number = 0;
  selectedTeams = [];
  selectedManagers = [];
  private subscriptions: Subscription[] = [];
  fullName: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  managersList: any[] = [];
  projects: Project[] = [];
  isLoading: boolean = false;
  isLoggedIn!: User;
  displayedColumns: string[] = [
    'projectName',
    'client',
    'team',
    'managers',
    'status',
  ];
  dataSource: MatTableDataSource<Project>;

  constructor(private UserService: UserService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  ngOnInit() {
    const currentPage = 1;
    this.loadUsers(currentPage);

    this.isLoggedIn = this.UserService.getAuthUserFromCache();
    this.eId = this.UserService.getAuthUserId();
    this.loadProjects(this.resultPage, this.resultSize);

    this.UserService.profile();
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

  loadUsers(selectedPage: number): void {
    this.loadUsernames(selectedPage);
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
            .map((manager) => manager.firstName + ' ' + manager.lastName);
        },
        (error) => {
          console.log(error.error.message);
        }
      )
    );
  }

  addProjectData(projectData: any) {
    this.UserService.addProject(projectData).subscribe(
      (response: any) => {
        this.successMessage = 'Project added Successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        if (error.status == 400) {
          this.errorMessage = 'An error occurred while adding the project';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          this.errorMessage = 'An error occurred while adding the project';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        }
      }
    );
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  loadProjects(currentPage: number, resultSize: number) {
    this.isLoading = true;

    this.subscriptions.push(
      this.UserService.getAllProjects(currentPage, resultSize).subscribe(
        (projects: any[]) => {
          // Extract manager and team usernames
          const updatedProjects = projects.map((project) => {
            const managerUsername =
              project.managers?.map((member: any) => member.userName) || [];
            const teamUsernames =
              project.team?.map((member: any) => member.userName) || [];

            return {
              projectId: project.projectId,
              projectName: project.projectName,
              description: project.description,
              status: project.status,
              type: project.type,
              client: project.client,
              managerUsername: managerUsername,
              teamUsernames: teamUsernames,
            };
          });

          console.log(updatedProjects);

          // Update the data source
          this.projects.push(...updatedProjects);
          this.dataSource.data = this.projects;
          this.isLoading = false;

          if (this.projects.length <= 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
            this.noResultMessage = 'No result found.';
          }

          this.fetchingResult = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      )
    );
  }

  loadMoreProjects(): void {
    this.isLoading = true;
    this.loadProjects(this.resultPage, this.resultSize);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onDropdownFocusout(teams: NgModel) {
    if (this.selectedTeams.length === 0) {
      teams.control.markAsTouched();
    }
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewDetails(type: 'team' | ' managers', data: any) {
    this.dialog.open(ManagerandteamdetailsComponent, {
      width: '400px',
      data: { type, items: data },
    });
  }
}
