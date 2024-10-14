import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { JobCategory } from '../model/jobCategory';
import { DepartmentService } from '../service/departmentServices';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  sideNavStatus: boolean = false;
  private subscriptions: Subscription[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  searchTerm: string = '';
  isLoggedIn!: User;
  role: number;
  isLoading: boolean = false;
  isFormVisible = false;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) sort!: MatSort;
  isPasswordVisible = false;
  jobs: any;
  empStatus: any;
  jobTitle: any;
  departments: any;
  count: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService
  ) {
    this.dataSource = new MatTableDataSource<User>();
    this.role = this.userService.getAuthUserId();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.displayColumns();
    this.loadUsers(this.resultPage);
    this.getAllJobCategories();
    this.getEmpStatus();
    this.getJobTitle();
    this.getDepartments();
    this.userCount();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  saveUser(userData: any) {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Check token value

    this.userService.addUser(userData).subscribe(
      (response: any) => {
        this.successMessage = 'User added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding user:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred while adding the user';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  deleteUser(uId: number): void {
    this.openConfirmationDialog(uId);
  }

  enableUser(uId: number, event: any): void {
    this.enableUserConfirmationBox(uId, event);
  }

  loadUsers(currentPage: number): void {
    this.subscriptions.push(
      this.userService.getAllUsers(currentPage, this.resultSize).subscribe(
        (us: User[]) => {
          this.users = [...us, ...this.users];
          this.dataSource.data = this.users;
          if (us.length <= 0) this.hasMoreResult = false;
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

  loadMoreUsers(): void {
    this.isLoading = true;
    this.loadUsers(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  openConfirmationDialog(uId: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(uId).subscribe(
          (response: any) => {
            this.successMessage = 'User deleted Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not delete user';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  enableUserConfirmationBox(uId: number, event: any): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to enable this user?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.enableUser(uId).subscribe(
          (response: any) => {
            this.successMessage = 'User enabled Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not enable user';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      } else {
        event.source.checked = !event.checked;
      }
    });
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  openEditUser(uId: number): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '700px',
      data: uId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.successMessage = 'User updated Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not update user';
      }
    });
  }

  preventManualInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  isFormEmpty(form: NgForm): boolean {
    return (
      !form.valid ||
      Object.keys(form.controls).some(
        (control) => form.controls[control].value === ''
      )
    );
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  displayColumns() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = [
        'userId',
        'userName',
        'firstName',
        'gender',
        'deptId',
        'phoneNumber',
      ];
    } else {
      this.displayedColumns = [
        'userId',
        'userName',
        'firstName',
        'gender',
        'deptId',
        'phoneNumber',
        'enable',
        'actions',
      ];
    }
  }

  showForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  showPassword() {
    this.isPasswordVisible = true;
  }

  hidePassword() {
    this.isPasswordVisible = false;
  }

  getAllJobCategories() {
    this.userService.getAllJobCat().subscribe((data) => {
      this.jobs = data;
    });
  }

  getEmpStatus() {
    this.userService.getAllEmpS().subscribe((data) => {
      this.empStatus = data;
    });
  }

  getJobTitle() {
    this.userService.getAllJobTitle().subscribe((data) => {
      this.jobTitle = data;
      // console.table(this.jobTitle);
    });
  }

  getDepartments() {
    this.departmentService.getAllDDept().subscribe((data) => {
      this.departments = data;
    });
  }

  userCount() {
    this.userService.userCount().subscribe((data) => {
      this.count = data;
    });
  }

  onRowClick(userId: number) {
    this.router.navigate(['/user-details', userId]);
  }
}


