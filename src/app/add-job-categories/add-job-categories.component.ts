import { Component } from '@angular/core';
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-job-categories',
  templateUrl: './add-job-categories.component.html',
  styleUrls: ['./add-job-categories.component.css'],
})
export class AddJobCategoriesComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  isSidebarExpanded: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  addJobCategory(jobCategory: any) {
    const token = localStorage.getItem('token');
    this.userService.addJobCategory(jobCategory).subscribe(
      (response: any) => {
        this.successMessage = 'Job Category added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding job category :', error);
        this.errorMessage =
          error.error?.message ||
          'An error occurred while adding the job category ';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  goToAddJobCat() {
    this.router.navigate(['/job-categories']);
  }
}
