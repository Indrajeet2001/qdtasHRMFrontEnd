import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/userServices';
import { User } from '../model/user';

@Component({
  selector: 'app-show-emp-details',
  templateUrl: './show-emp-details.component.html',
  styleUrls: ['./show-emp-details.component.css']
})
export class ShowEmpDetailsComponent {
  sideNavStatus: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  

  user: User | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: number,
    private userService: UserService,public dialog: MatDialog, private http: HttpClient
  ) {}

  // ngOnInit(): void {
  //   this.userService.getUserById(this.userId).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     (error) => {
  //       console.error('Failed to load user data', error);
  //     }
  //   );
  // }


  isFormSubmitted: boolean = false;
  // constructor(private UserService: UserService, ) {
  // }

  u!: User;

  fromDate: Date | undefined;
  toDate: Date | undefined;


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

  calculatePerformance() {
    if (this.fromDate && this.toDate) {
      // Process the dates and perform the calculation
      console.log('From Date:', this.fromDate);
      console.log('To Date:', this.toDate);
      // Add your calculation logic here
    } else {
      this.errorMessage = 'Please select both From and To dates.';
    }
  }



  saveEmployee() {
    this.isFormSubmitted = true;
  }

  ngOnInit() {
    
    // this.UserService.profile();
    // this.UserService.getUserById(this.UserService.getAuthUserId()).subscribe(user => {
    //   this.u = user;
    //   this.isLoading = false;
    // });
    this.userService.getUserById(this.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load user data', error);
      }
    );
  }

  // isSidebarExpanded: boolean = true;


  // onToggleSidebar(expanded: boolean) {
  //   this.isSidebarExpanded = expanded;
  // }



  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

}
