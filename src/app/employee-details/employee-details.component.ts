

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
  styleUrls: ['./employee-details.component.css']
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
    this.isLoading = true;
    // this.userService.getUserById(this.userService.getAuthUserId()).subscribe(
    //   (user: User) => {
    //     this.u = user;
    //     this.isLoading = false;
    //   },
    //   error => {
    //     this.errorMessage = "Failed to load user data";
    //     this.isLoading = false;
    //   }
    // );
  }

  showDetails(form: NgForm): void {
    if (form.valid) {
      const username = form.value.UserName;
      this.loadUsers(username);
    }
  }

  // OpenDetails(userId: number): void {
  //   this.isLoading = true; // Show the loader
  //   const dialogRef = this.dialog.open(ShowEmpComponent, {
  //     width: '700px',
  //     data: userId,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.isLoading = false; // Hide the loader
  //     if (result === 'success') {
  //       this.successMessage = 'Details loaded successfully';
  //     } else if (result === 'failure') {
  //       this.errorMessage = 'Could not load details';
  //     }
  //   });
  // }


  // loadUser(username: string): void {
  //   this.subscriptions.push(
  //     this.userService.getUserByUsername(username).subscribe(
  //       (user: User) => {
  //         this.users.push(user);
  //         this.dataSource.data = this.users;
  //       },
  //       (error: any) => {
  //         console.error('Error occurred while loading user:', error);
  //         this.errorMessage = 'Failed to load user data';
  //       }
  //     )
  //   );
  // }

  loadUsers(username: string): void {
    this.subscriptions.push(
      this.userService.getUsersByUsername(username).subscribe(
        (users: User[]) => {
          // Add the retrieved users to the existing users array
          this.users = this.users.concat(users);
          this.dataSource.data = this.users;
        },
        (error: any) => {
          console.error('Error occurred while loading users:', error);
          this.errorMessage = 'Failed to load user data';
        }
      )
    );
  }

  OpenDetails(userId : Number) : void{
    const dialogRef = this.dialog.open(ShowEmpDetailsComponent , {
      // width : '1000px',
      // data : userId,
      width: '80%', // Adjust width as per your preference
      height: '100%', // Adjust height as per your preference
      data: userId,
      maxHeight: '90vh', // Ensure the dialog does not exceed 90% of the viewport height
    
    });
    dialogRef.afterClosed().subscribe(result => {})
  }

  // showDetails(employeeDetails: NgForm) {
  //   if (employeeDetails.valid) {
  //     this.userFields = [];
  //     const formValue = employeeDetails.value;
  //     // Example: Assuming user is an object with properties matching form fields
  //     this.user = { 
  //       firstName: formValue.UserName.split(' ')[0],
  //       middleName : formValue.UserName.split(' ')[1],
  //       lastName: formValue.UserName.split(' ')[2],
  //       email: formValue.email
  //       // Add other user properties as needed
  //     };
  //     // Populate userFields array with form values
  //     for (const [key, value] of Object.entries(formValue)) {
  //       this.userFields.push({ label: key, value: value });
  //     }
  //   }
  // }
  
  // getUserDetails(userId: number): void {
  //   // const userId = 1; // Example user ID, replace with your logic to get the user ID
  //   this.userService.getUserInfo(userId).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to load user details';
  //     }
  //   );
  // }

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
    return !form.valid || Object.keys(form.controls).some(control => form.controls[control].value === '');
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

    dialogRef.afterClosed().subscribe(result => {
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
      this.displayedColumns = ['userId', 'userName', 'designation', 'phoneNumber'];
    } else {
      this.displayedColumns = ['userId', 'userName', 'designation', 'phoneNumber'];
    }
  }

}
