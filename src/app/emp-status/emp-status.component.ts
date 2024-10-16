import { Component, ViewChild } from '@angular/core';
import {Subscription} from "rxjs";
import {EmpStatus} from "../model/empStatus";
import {User} from "../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import { MatSort } from '@angular/material/sort';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { EditEmpstatusComponent } from '../edit-empstatus/edit-empstatus.component';

@Component({
  selector: 'app-emp-status',
  templateUrl: './emp-status.component.html',
  styleUrls: ['./emp-status.component.css'],
})
export class EmpStatusComponent {
  jobs: EmpStatus[] = [];
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
  displayedColumns: string[] = [];
  count:number = 0;
  dataSource: MatTableDataSource<EmpStatus>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<EmpStatus>();
    this.role = this.userService.getAuthUserId();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.loadEmpStatus(this.resultPage);
        this.displayColumns();
        this.Count();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  loadEmpStatus(currentPage: number): void {
    this.subscriptions.push(
      this.userService.getAllEmpStatus(currentPage, this.resultSize).subscribe(
        (jb: EmpStatus[]) => {
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

  loadMoreEmpStatus(): void {
    this.isLoading = true;
    this.loadEmpStatus(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  deleteEmpStatus(uId: number): void {
    this.openConfirmationDialog(uId);
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
        this.userService.deleteEmpStatus(uId).subscribe(
          (response: any) => {
            this.successMessage = 'Employee status deleted Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not delete employee status';
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

  eidtEmpStatus(jobId: number): void {
    const dialogRef = this.dialog.open(EditEmpstatusComponent, {
      width: '800px',
      data: { jobId: jobId },
    });

    dialogRef.afterClosed().subscribe((result) => {
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

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  displayColumns() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = ['employmentStatusId', 'employmentStatusName'];
    } else {
      this.displayedColumns = [
        'employmentStatusId',
        'employmentStatusName',
        'action',
      ];
    }
  }

  Count () {
    this.userService.empStatusCount().subscribe((data)=>{
      this.count = data
    })
  }
}
