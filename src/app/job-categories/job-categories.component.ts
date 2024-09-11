import { Component, ViewChild } from '@angular/core';
import {JobCategory} from "../model/jobCategory";
import {Subscription} from "rxjs";
import {User} from "../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { MatSort } from '@angular/material/sort';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { EditJobcategoriesComponent } from '../edit-jobcategories/edit-jobcategories.component';

@Component({
  selector: 'app-job-categories',
  templateUrl: './job-categories.component.html',
  styleUrls: ['./job-categories.component.css'],
})
export class JobCategoriesComponent {
  jobs: JobCategory[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  sideNavStatus: boolean = false;
  private subscriptions: Subscription[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  searchTerm: string = '';
  isLoggedIn!: User;
  role!: number;
  isLoading: boolean = false;
  displayedColumns: string[] = ['jobCategoryId', 'jobCategoryName', 'action'];
  dataSource: MatTableDataSource<JobCategory>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<JobCategory>();
    this.role = this.userService.getAuthUserId();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.loadJobs(this.resultPage);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  isSidebarExpanded: boolean = true;

  loadJobs(currentPage: number): void {
    this.subscriptions.push(
      this.userService
        .getAllJobCategory(currentPage, this.resultSize)
        .subscribe(
          (jb: JobCategory[]) => {
            this.jobs = [...jb, ...this.jobs];
            this.dataSource.data = this.jobs;
            if (jb.length <= 0) this.hasMoreResult = false;
            this.fetchingResult = false;
            this.resultPage++;
          },
          (error) => {
            console.log(error.error.message);
            this.fetchingResult = false;
          }
        )
    );
  }

  loadMoreJobs(): void {
    this.isLoading = true;
    this.loadJobs(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  deleteJobCategory(uId: number): void {
    this.openConfirmationDialog(uId);
    console.log(uId);
  }

  openConfirmationDialog(uId: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteJobCategory(uId).subscribe(
          (response: any) => {
            this.successMessage = 'Job category deleted Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not delete job category';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  editJob(jobId: number): void {
    const dialogRef = this.dialog.open(EditJobcategoriesComponent, {
      width: '800px',
      data: { jobId: jobId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(jobId);

      if (result === 'success') {
        this.successMessage = 'User updated Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not update user';
      }
    });
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
