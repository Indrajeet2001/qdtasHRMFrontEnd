

import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../service/userServices';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { ShowEmpDetailsComponent } from '../show-emp-details/show-emp-details.component';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  // showDetails(_t23: NgForm) {
  // throw new Error('Method not implemented.');
  // }
  sideNavStatus: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isFormSubmitted: boolean = false;
  u: User | undefined; // Store the user details here
  users: User[] = []; // Define users array to store form values
  isLoggedIn: User | undefined;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('employeeDetails') employeeDetails!: NgForm;
  isSidebarExpanded: boolean = true;
  user: any;
  subscriptions: Subscription[] = []; // Initialize subscriptions array

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<User>(this.users);
  }

  ngOnInit() {
    console.table(this.u);
    this.isLoading = true;
  }

  showDetails(form: NgForm): void {
    if (form.valid) {
      const username = form.value.UserName;
      this.loadUsers(username);
    }
  }

  loadUsers(username: string): void {
    this.subscriptions.push(
      this.userService.getUsersByUsername(username).subscribe(
        (users: User[]) => {
          if (users.length === 0) {
            // No users found for the given username
            this.errorMessage = 'Employee name not valid';
          } else {
            // Add the retrieved users to the existing users array
            this.users = this.users.concat(users);
            this.dataSource.data = this.users;
            this.isFormSubmitted = true;
          }
        },
        (error: any) => {
          // Differentiate between various types of errors
          if (error.status === 404) {
            this.errorMessage = 'Employee name not found';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error occurred while loading users';
          } else {
            this.errorMessage = `Employee name not found`;
          }
          console.error('Error occurred while loading users:', error);
        }
      )
    );
  }

  OpenDetails(userId: Number): void {
    const dialogRef = this.dialog.open(ShowEmpDetailsComponent, {
      // width : '1000px',
      // data : userId,
      width: '80%', // Adjust width as per your preference
      height: '50%', // Adjust height as per your preference
      data: userId,
      // Ensure the dialog does not exceed 90% of the viewport height
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  isMale(): string {
    if (this.u && this.u.gender) {
      const gender = this.u.gender.toLowerCase();
      if (gender === 'male') {
        return './assets/images/male.png';
      } else if (gender === 'female') {
        return './assets/images/female.png';
      } else {
        return './assets/images/default.png';
      }
    } else {
      return './assets/images/default.png';
    }
  }

  isFormEmpty(form: NgForm): boolean {
    return (
      !form.valid ||
      Object.keys(form.controls).some(
        (control) => form.controls[control].value === ''
      )
    );
  }

  saveEmployee() {
    this.isFormSubmitted = true;
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

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  openEditUser(uId: number): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '700px',
      data: uId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.successMessage = 'Updated Successfully';
        window.location.reload();
      } else if (result == 'failure') {
        this.errorMessage = 'Could not update';
      }
    });
  }

  displayColumns() {
    if (this.isLoggedIn && this.isLoggedIn.role === 'ROLE_DEPT') {
      this.displayedColumns = ['userId', 'userName', 'jobtitle', 'phoneNumber'];
    } else {
      this.displayedColumns = ['userId', 'userName', 'jobtitle', 'phoneNumber'];
    }
  }
}
