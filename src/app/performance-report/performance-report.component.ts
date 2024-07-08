import { Component, Inject } from '@angular/core';
import { User } from "../model/user";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { UserService } from "../service/userServices";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.css']
})
export class PerformanceReportComponent {
  sideNavStatus: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  performanceValue: number | null = null; // Change type to number
  isSidebarExpanded: boolean = true;

  user: User | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserById(this.data.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load user data', error);
        this.isLoading = false;
      }
    );
  }

  isFormSubmitted: boolean = false;
  fromDate: Date | undefined;
  toDate: Date | undefined;

  calculatePerformance() {
    if (this.fromDate && this.toDate && this.data.userId) {
      const startDate = this.fromDate.toISOString().split('T')[0];
      const endDate = this.toDate.toISOString().split('T')[0];

      this.userService.getUserPerformance(this.data.userId, startDate, endDate).subscribe(
        (performance: number) => {
          console.log('Performance:', performance);
          this.performanceValue = performance;
          this.successMessage = `Performance calculated successfully: ${performance}`;
        },
        (error) => {
          console.error('Error occurred while calculating performance:', error);
          this.errorMessage = 'Something went wrong while calculating performance.';
        }
      );
    } else {
      this.errorMessage = 'Please select both From and To dates.';
    }
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }
}
