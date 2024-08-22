import { Component } from '@angular/core';
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-job-title',
  templateUrl: './add-job-title.component.html',
  styleUrls: ['./add-job-title.component.css']
})
export class AddJobTitleComponent {
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

  addJobTitle(jobData: any) {
    const token = localStorage.getItem('token');
    this.userService.addJobTitle(jobData).subscribe(
      (response: any) => {
        console.log('added');

        this.successMessage = 'Job title added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding job title :', error);
        this.errorMessage =
          error.error?.message ||
          'An error occurred while adding the job title ';
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
}
