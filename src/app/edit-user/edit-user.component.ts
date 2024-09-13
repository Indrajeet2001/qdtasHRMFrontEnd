// 
import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { User } from '../model/user';
import { DepartmentService } from '../service/departmentServices';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public userId: number
  ) {}

  selectedField: string = '';
  newUsername: string = '';
  newEmail: string = '';
  newfirstName: string = '';
  newmiddleName: string = '';
  newlastName: string = '';
  newphoneno: number = 0;
  newbirthdate: string = '';
  newdeptId: string = '';
  newgender: string = '';
  newrole: string = '';
  newdesignation: string = '';
  newpassword: string = '';
  newjobCategoryId: string = '';
  newemploymentStatusId: string = '';
  newjobId: string = '';
  uId: number = this.userId;

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn!: User;
  u!: User;

  jobs: any;
  empStatus: any;
  jobTitle: any;
  departments: any;

  ngOnInit() {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.userService.getUserById(this.uId).subscribe((user) => {
      this.u = user;
    });
       this.getAllJobCategories();
       this.getEmpStatus();
       this.getJobTitle();
       this.getDepartments();
  }

  onFieldSelect(event: any) {
    this.selectedField = event.target.value;
  }

  saveEditedData(data: any) {
    this.userService.updateUser(this.uId, data).subscribe(
      (res: any) => {
        this.successMessage = 'User updated Successfully';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.dialogRef.close('success');
      },
      (error: any) => {
        this.errorMessage = 'Error in updating user';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
        this.dialogRef.close('failure');
      }
    );
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  dismissDialogBox() {
    this.dialogRef.close();
  }

  preventManualInput(event: KeyboardEvent) {
    event.preventDefault();
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
      console.table(this.departments);
    });
  }
}
