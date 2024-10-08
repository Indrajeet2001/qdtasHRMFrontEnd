import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from '../service/departmentServices';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from '../model/department';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { EditDepartmentComponent } from '../edit-department/edit-department.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from '../model/user';
import { UserService } from '../service/userServices';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  sideNavStatus: boolean = false;
  private subscriptions: Subscription[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  searchTerm: string = '';
  // isLoggedIn!: Department;
  isLoggedIn!: User;
  isLoading: boolean = false;
  displayedColumns: string[] = [];
  count:number = 0;
  dataSource: MatTableDataSource<Department>;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private departmentService: DepartmentService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Department>();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.displayColumnss();
    console.log(this.isLoggedIn);
    this.loadDepartments(this.resultPage);
    this.Count();
  }

  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  saveDepartment(departmentData: any) {
    this.departmentService.addDepartment(departmentData).subscribe(
      (response: any) => {
        this.successMessage = 'Department added Successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        this.errorMessage = 'An error occurred while adding the department';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }
    );
  }

  deleteDepartment(deptId: number): void {
    this.openConfirmationDialog(deptId);
  }

  loadDepartments(currentPage: number): void {
    this.subscriptions.push(
      this.departmentService
        .getAllDepartments(currentPage, this.resultSize)
        .subscribe(
          (department: Department[]) => {
            this.departments.push(...department);
            this.dataSource.data = this.departments;
            if (this.departments.length <= 0) this.hasMoreResult = false;
            this.fetchingResult = false;
            this.resultPage++;
          },
          (error) => {
            console.log(error.error.message);
          }
        )
    );
  }

  loadMoreDepartments(): void {
    this.isLoading = true;
    this.loadDepartments(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  openConfirmationDialog(deptId: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.departmentService.deleteDepartment(deptId).subscribe(
          (response: any) => {
            this.successMessage = 'Department deleted Successfully';
            setTimeout(() => {
              this.errorMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not delete department';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  openEditDepartment(deptId: number): void {
    const dialogRef = this.dialog.open(EditDepartmentComponent, {
      width: '700px',
      data: deptId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.successMessage = 'Department updated Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not update department';
      }
    });
  }

  preventManualInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  isFormEmpty(form: NgForm): boolean {
    return (
      !form.valid ||
      Object.keys(form.controls).some(
        (control) => form.controls[control].value === ''
      )
    );
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  // displayColumns() {
  //   if (this.isLoggedIn && this.isLoggedIn.role === 'ROLE_DEPT') {
  //     this.displayedColumns = ['deptId', 'deptName'];
  //   } else {
  //     this.displayedColumns = ['deptId', 'deptName', 'actions'];
  //   }
  // }

  displayColumnss() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = ['deptId', 'deptName'];
    } else {
      this.displayedColumns = ['deptId', 'deptName', 'actions'];
    }
  }

  Count () {
    this.userService.deptCount().subscribe((data)=>{
      this.count = data
    })
  }
}
