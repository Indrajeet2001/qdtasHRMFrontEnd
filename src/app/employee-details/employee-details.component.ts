// import { Component, OnInit, ViewChild } from '@angular/core';
// import { UserService } from '../service/userServices';
// import { MatDialog } from '@angular/material/dialog';
// import { HttpClient } from '@angular/common/http';
// import { User } from '../model/user';
// import { NgForm } from '@angular/forms';
// import { EditUserComponent } from '../edit-user/edit-user.component';

// @Component({
//   selector: 'app-employee-details',
//   templateUrl: './employee-details.component.html',
//   styleUrls: ['./employee-details.component.css']
// })
// export class EmployeeDetailsComponent implements OnInit {
// [x: string]: any;

//   sideNavStatus: boolean = true;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   isLoading: boolean = false;
//   isFormSubmitted: boolean = false;
//   u!: User; // Store the user details here

//   @ViewChild('employeeDetails') employeeDetails!: NgForm;
//   isSidebarExpanded: boolean = true;
// user: any;

//   constructor(private userService: UserService, public dialog: MatDialog, private http: HttpClient) {
//   }

//   ngOnInit() {
//     this.isLoading = true;
//     this.userService.getUserById(this.userService.getAuthUserId()).subscribe(
//       (user: User) => {
//         this.u = user;
//         this.isLoading = false;
//       },
//       error => {
//         this.errorMessage = "Failed to load user data";
//         this.isLoading = false;
//       }
//     );
//   }

//   showDetails(employeeDetails: NgForm) {
//     if (employeeDetails.valid) {
//       this['userFields'] = [];
//       const formValue = employeeDetails.value;
//       // Example: Assuming user is an object with properties matching form fields
//       this.user = { 
//         firstName: formValue.UserName.split(' ')[0],
//         lastName: formValue.UserName.split(' ')[1],
//         // Add other user properties as needed
//       };
//       // Populate userFields array with form values
//       for (const [key, value] of Object.entries(formValue)) {
//         this['userFields'].push({ label: key, value: value });
//       }
//     }
//   }
//   getUserDetails(): void {
//     const userId = 1; // Example user ID, replace with your logic to get the user ID
//     this.userService.getUserInfo(userId).subscribe(
//       (user: User) => {
//         this.user = user;
//       },
//       (error) => {
//         this.errorMessage = 'Failed to load user details';
//       }
//     );
//   }

//   isMale(): string {
//     if (this.u && this.u.gender) {
//       const gender = this.u.gender.toLowerCase();
//       if (gender === 'male') {
//         return './assets/images/male.png';
//       } else if (gender === 'female') {
//         return './assets/images/female.png';
//       } else {
//         return './assets/images/default.png';
//       }
//     } else {
//       return './assets/images/default.png';
//     }
//   }

//   saveEmployee() {
//     this.isFormSubmitted = true;
//   }

//   dismissSuccessMessage() {
//     this.successMessage = null;
//   }

//   dismissErrorMessage() {
//     this.errorMessage = null;
//   }

//   onToggleSidebar(expanded: boolean) {
//     this.isSidebarExpanded = expanded;
//   }

//   openEidtUser(uId: number): void {
//     const dialogRef = this.dialog.open(EditUserComponent, {
//       width: '700px',
//       data: uId,
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result == 'success') {
//         this.successMessage = 'Updated Successfully';
//         window.location.reload();

//       } else if (result == 'failure') {
//         this.errorMessage = 'Could not update';
//       }
//     });
//   }
// }

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

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
showDetails(_t23: NgForm) {
throw new Error('Method not implemented.');
}
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
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUserById(this.userService.getAuthUserId()).subscribe(
      (user: User) => {
        this.u = user;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = "Failed to load user data";
        this.isLoading = false;
      }
    );
  }

  loadUser(username: string): void {
    this.subscriptions.push(
      this.userService.getUserByUsername(username).subscribe(
        (user: User) => {
          this.users.push(user);
          this.dataSource.data = this.users;
        },
        (error: any) => {
          console.error('Error occurred while loading user:', error);
          this.errorMessage = 'Failed to load user data';
        }
      )
    );
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
  
  getUserDetails(): void {
    const userId = 1; // Example user ID, replace with your logic to get the user ID
    this.userService.getUserInfo(userId).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        this.errorMessage = 'Failed to load user details';
      }
    );
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
      this.displayedColumns = ['userId', 'userName', 'emailId', 'designation', 'phoneNumber', 'deptId'];
    } else {
      this.displayedColumns = ['userId', 'userName', 'emailId', 'designation', 'phoneNumber', 'deptId'];
    }
  }

}
