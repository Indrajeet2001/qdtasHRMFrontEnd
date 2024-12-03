import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { MatTableDataSource } from '@angular/material/table';
import { Tasks } from '../model/Tasks';
import { Subscription } from 'rxjs';
import { User } from '../model/user';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  isSidebarExpanded: boolean = true;
  isLoggedIn!: User;
  u!: User;
  users: any[] = [];
  managers: any[] = [];
  userIds: number[] = [];
  selectedUserId!: number;
  userIdInput!: number;
  currentPage: number = 1;
  tasks: Tasks[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'dueDate',
    'assignee',
    'empId',
  ];
  dataSource: MatTableDataSource<Tasks>;

  constructor(private UserService: UserService) {
    this.dataSource = new MatTableDataSource<Tasks>();
  }

  ngOnInit() {
    this.getUsers();
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  getUsers(): void {
    this.UserService.getAllUsersList().subscribe(
      (data) => {
        this.users = data;
        this.managers = this.users.filter((u) => u.subRole === 'ROLE_MANAGER');
        this.userIds = this.users.map((u) => u.userId);

        if (this.userIds.length > 0) {
          this.selectedUserId = this.userIds[0];
          this.loadTasks(this.selectedUserId, this.currentPage);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onUserChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedUserId = Number(selectElement.value);
  }

  assignTask(taskData: any) {
    const token = localStorage.getItem('token');
    this.UserService.addTasks(taskData).subscribe(
      (response: any) => {
        this.successMessage = 'Task assigned successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error while assigning task:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred while assigning task ';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  loadTasks(userId: number, currentPage: number): void {
    this.fetchingResult = true;
    this.tasks = [];
    this.dataSource.data = this.tasks;

    this.subscriptions.push(
      this.UserService.getTasksById(userId, currentPage, 2000).subscribe(
        (t: Tasks[]) => {
          this.tasks = t;
          this.dataSource.data = this.tasks;
          if (t.length <= 0) this.hasMoreResult = false;
          this.fetchingResult = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error.error.message);
          this.fetchingResult = false;
        }
      )
    );
  }

  fetchTasksByInput(): void {
    if (this.userIdInput !== null && this.userIdInput !== undefined) {
      this.currentPage = 1;
      this.loadTasks(this.userIdInput, this.currentPage);
    } else {
      this.errorMessage = 'Please enter a valid User ID.';
    }
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }
}
