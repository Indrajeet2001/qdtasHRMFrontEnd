import { Component } from '@angular/core';
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-emp-status',
  templateUrl: './add-emp-status.component.html',
  styleUrls: ['./add-emp-status.component.css'],
})
export class AddEmpStatusComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  isSidebarExpanded: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  addEmpStatus(emp: any) {
    const token = localStorage.getItem('token');
    this.userService.addEmpStatus(emp).subscribe(
      (response: any) => {
        this.successMessage = 'Employment status added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding employment status :', error);
        this.errorMessage =
          error.error?.message ||
          'An error occurred while adding the employment status ';
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

  goToEmpStatus () {
    this.router.navigate(['/emp-status']);
  }

}
