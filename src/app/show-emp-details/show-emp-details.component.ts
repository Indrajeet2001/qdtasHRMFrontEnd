import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/userServices';
import { User } from '../model/user';
import {Router} from "@angular/router";
import {PerformanceReportComponent} from "../performance-report/performance-report.component";

@Component({
  selector: 'app-show-emp-details',
  templateUrl: './show-emp-details.component.html',
  styleUrls: ['./show-emp-details.component.css'],
})
export class ShowEmpDetailsComponent {
  sideNavStatus: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  performanceValue: string | null = null;

  user: User | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: number,
    private userService: UserService,
    public dialog: MatDialog,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ShowEmpDetailsComponent>, // Add this parameter,
    private router: Router
  ) {}

  ngOnInit() {
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

  // calculatePerformance() {
  //   if (this.fromDate && this.toDate) {
  //     // Process the dates and perform the calculation
  //     console.log('From Date:', this.fromDate);
  //     console.log('To Date:', this.toDate);
  //     // Add your calculation logic here
  //   } else {
  //     this.errorMessage = 'Please select both From and To dates.';
  //   }
  // }

  calculatePerformance() {
    if (this.fromDate && this.toDate) {
      const startDate = this.fromDate.toISOString().split('T')[0];
      const endDate = this.toDate.toISOString().split('T')[0];

      this.userService
        .getUserPerformance(this.userId, startDate, endDate)
        .subscribe(
          (performance: number) => {
            console.log('Performance:', performance);
            this.successMessage = `Performance calculated successfully: ${performance}`;
          },
          (error) => {
            console.error(
              'Error occurred while calculating performance:',
              error
            );
            this.errorMessage =
              'Something went wrong while calculating performance.';
          }
        );
    } else {
      this.errorMessage = 'Please select both From and To dates.';
    }
  }

  saveEmployee() {
    this.isFormSubmitted = true;
  }

  openPerformance_Report(): void {
    this.dialogRef.close(); 

    const dialogRef = this.dialog.open(PerformanceReportComponent, {
      width: '700px',
      data: { userId: this.userId }, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.successMessage = 'Calculated report Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not calculate report';
      }
    });
  }

 

  dismissDialogBox() {
    this.dialogRef.close();
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }
}
