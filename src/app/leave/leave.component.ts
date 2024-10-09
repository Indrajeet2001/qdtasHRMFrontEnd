import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { MatDialog } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../model/user';
import { Leave } from '../model/leave';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
})
export class LeaveComponent {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Leave>;

  constructor(
    private UserService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.minDate = currentDate;
    this.dataSource = new MatTableDataSource<Leave>();
  }

  minDate: Date;
  startDate!: Date;

  sideNavStatus: boolean = false;
  u: User = this.UserService.getAuthUserFromCache();
  empId: number = this.UserService.getAuthUserId();
  leaves: Leave[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  private subscriptions: Subscription[] = [];
  isLoggedIn!: User;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  leave: any;
  ngOnInit() {
    this.UserService.profile();
    this.empId = this.UserService.getAuthUserId();
    this.loadLeaves(this.resultPage);
    this.isLoggedIn = this.UserService.getAuthUserFromCache();
    this.displayColumns();
    this.u;
  }

  isSidebarExpanded: boolean = true;
  isLoading: boolean = false;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  applyLeave(userData: any) {
    const empIdString = this.empId.toString();

    if (userData.startDate) {
      const startDate = new Date(userData.startDate);
      const startDateFormatted = new Date(
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        )
      );
      userData.startDate = startDateFormatted.toISOString().split('T')[0];
    }
    if (userData.endDate) {
      const endDate = new Date(userData.endDate);
      const endDateFormatted = new Date(
        Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      );
      userData.endDate = endDateFormatted.toISOString().split('T')[0];
    }

    this.UserService.applyLeave(userData, empIdString).subscribe(
      (response: any) => {
        this.successMessage = 'Leave Applied Successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error occurred:', error);
        this.errorMessage = 'Something went wrong';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  loadLeaves(currentPage: number) {
    this.subscriptions.push(
      this.UserService.getAllLeaves(currentPage, this.resultSize).subscribe(
        (l: Leave[]) => {
          this.leaves = [...l, ...this.leaves];
          this.dataSource.data = this.leaves;
          if (this.leaves.length <= 0 && this.resultPage === 1) {
            this.hasMoreResult = false;
          }
          this.fetchingResult = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error.error.message);
        }
      )
    );
  }

  loadMoreleaves(): void {
    this.isLoading = true;
    this.loadLeaves(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  rejectLeave(id: number): void {
    this.openConfirmationDialog(id);
  }

  openConfirmationDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to reject this leave?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.UserService.changeLeaveStatus(index).subscribe(
          (response: any) => {
            this.successMessage = 'Leave Rejected';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  leaveApprovalStatus: { [key: number]: boolean } = {};

  approveLeave(id: number): void {
    this.openConfirmDialog(id);
  }

  openConfirmDialog(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to Approve this leave?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.UserService.changeLeaveStatusApprove(index).subscribe(
          (response: any) => {
            this.successMessage = 'Leave Accepted';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  

  deleteLeave(id: number) {
    this.openConfirmDialogforDelete(id);
  }

  openConfirmDialogforDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to Delete this leave?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.UserService.deleteLeave(index).subscribe(
          (response: any) => {
            this.successMessage = 'Leave Deleted';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Something went wrong';
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

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openLeaveReports() {
    this.router.navigate(['/reports']);
  }

  displayColumns() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = [
        'employee',
        'startDate',
        'endDate',
        'type',
        'reason',
        'status',
      ];
    } else {
      this.displayedColumns = [
        'employee',
        'startDate',
        'endDate',
        'type',
        'reason',
        'status',
        'actions',
      ];
    }
  }
}
