
import { Component, Inject, OnInit } from '@angular/core';
import { DepartmentComponent } from '../department/department.component';
import { DepartmentService } from '../service/departmentServices';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from '../model/department';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  selectedField: string = '';
  newDeptName: string = '';
  currentDeptName: string = ''; // This should be fetched from your service or passed as input
  uId: number = this.deptId;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn!: Department;
  u!: Department;
  isLoading: boolean = true;

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public deptId: number
  ) {
    this.uId = this.deptId;
  }

  ngOnInit() {
    this.loadDepartmentDetails();
  }

  loadDepartmentDetails() {
    this.departmentService.getDeptById(this.uId).subscribe(
      (department: Department) => {
        this.u = department;
        this.currentDeptName = department.deptName ?? '';
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching department details', error);
        this.errorMessage = 'Error fetching department details';
        this.isLoading = false;
      }
    );
  }

  onFieldSelect(event: any) {
    this.selectedField = event.target.value;
  }

  isSameDeptName(): boolean {
    return this.newDeptName.trim().toLowerCase() === this.currentDeptName?.trim().toLowerCase();
  }

  saveEditedData(data: any) {
    if (this.isSameDeptName()) {
      this.errorMessage = 'Entered Department Name is the same as the current Department Name';
      return;
    }

    this.departmentService.updateDepartment(this.uId, data).subscribe(
      (res: any) => {
        this.successMessage = 'Department updated Successfully';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.dialogRef.close('success');
      },
      (error: any) => {
        this.errorMessage = 'Error in updating department';
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
}
