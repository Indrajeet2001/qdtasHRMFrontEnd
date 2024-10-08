import { Component, ViewChild } from '@angular/core';
import { WorkShift } from '../model/workshift';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../service/userServices';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../model/user';
import { EditWorkshiftsComponent } from '../edit-workshifts/edit-workshifts.component';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';

@Component({
  selector: 'app-workshifts',
  templateUrl: './workshifts.component.html',
  styleUrls: ['./workshifts.component.css'],
})
export class WorkshiftsComponent {
  shifts: WorkShift[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  role!: number;
  isLoggedIn!: User;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private subscriptions: Subscription[] = [];
  isSidebarExpanded: boolean = true;
  isLoading: boolean = false;
  count: number = 0;
  displayedColumns: string[] = [
    'workShiftId',
    'workShiftName',
    'startTime',
    'endTime',
    'action',
  ];
  dataSource: MatTableDataSource<WorkShift>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<WorkShift>();
    this.role = this.userService.getAuthUserId();
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.loadShifts(this.resultPage);
    this.displayColumns();
    this.Count();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadShifts(currentPage: number): void {
    this.subscriptions.push(
      this.userService.getAllWorkshift(currentPage, this.resultSize).subscribe(
        (ws: WorkShift[]) => {
          this.shifts = [...ws, ...this.shifts];
          this.dataSource.data = this.shifts;
          if (ws.length <= 0) this.hasMoreResult = false;
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

  loadMoreShifts(): void {
    this.isLoading = true;
    this.loadShifts(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  deleteShifts(uId: number): void {
    this.openConfirmationDialog(uId);
    console.log(uId);
  }

  openConfirmationDialog(wId: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteWorkshift(wId).subscribe(
          (response: any) => {
            this.successMessage = 'Workshift deleted Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not delete workshift';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }

  editShifts(workId: number): void {
    const dialogRef = this.dialog.open(EditWorkshiftsComponent, {
      width: '800px',
      data: { workId: workId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(workId);

      if (result === 'success') {
        this.successMessage = 'Workshift updated Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not update workshift';
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

  displayColumns() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = [
        'workShiftId',
        'workShiftName',
        'startTime',
        'endTime',
      ];
    } else {
      this.displayedColumns = [
        'workShiftId',
        'workShiftName',
        'startTime',
        'endTime',

        'action',
      ];
    }
  }

  Count () {
    this.userService.workCount().subscribe((data)=>{
      this.count = data;
    })
  }
}
