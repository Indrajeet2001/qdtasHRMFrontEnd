import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../service/userServices';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Time } from '../model/time';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
})
export class TimeComponent implements OnInit {
  users: User[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  private subscriptions: Subscription[] = [];
  timeSheets: Time[] = [];
  //noResultMessage: string = '';
  eId: Number = 0;
  isLoading: boolean = false;
  searchTerm: string = '';
  sideNavStatus: boolean = false;
  minDate: Date;
  maxDate!: Date;
  startDate!: Date;
  isSidebarExpanded: boolean = true;
  u!: User;
  displayedColumns: string[] = [
    'userId',
    'firstName',
    'lastName',
    'deptId',
    'designation',
    'view',
  ];
  dataSource: MatTableDataSource<User>;
  empId: number = this.UserService.getAuthUserId();
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn!: User;
  displayedColumnsForUser: string[] = ['date', 'startTime', 'endTime', 'note'];
  dataSourceForUser: MatTableDataSource<Time>;
  @ViewChild('endDate') endDateInput: any; // This allows accessing the input element in the template
  endDate: string = '';
  startTime: string = '';
  endTime: string = '';
  private location: any;
  timeSheetData: any;

  constructor(
    private UserService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    const currentDate = new Date();
    const mDate = new Date();
    currentDate.setDate(currentDate.getDate());
    this.minDate = currentDate;
    mDate.setDate(mDate.getDate() - 7);
    this.maxDate = mDate;
    this.dataSource = new MatTableDataSource();
    this.dataSourceForUser = new MatTableDataSource();
  }

  ngOnInit() {
    this.isLoggedIn = this.UserService.getAuthUserFromCache();
    this.eId = this.UserService.getAuthUserId();
    console.log(this.eId);
    this.loadTimeSheet(this.resultPage, this.resultSize, this.eId);
    this.isLoading = true;
    this.UserService.getUserById(this.UserService.getAuthUserId()).subscribe(
      (user) => {
        this.u = user;
        this.isLoading = false;
      }
    );
    this.UserService.profile();
    this.loadUsers(this.resultPage);
    this.getProjects();
 
  }

  updateTimeConstraints() {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.endTime.split(':').map(Number);

    const startTimeDate = new Date();
    startTimeDate.setHours(startHour, startMinute);

    const endTimeDate = new Date();
    endTimeDate.setHours(endHour, endMinute);

    if (endTimeDate < startTimeDate) {
      this.errorMessage = 'End time entered should be after start time';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      this.endTime = '--:--';
    } else if (endTimeDate.getTime() === startTimeDate.getTime()) {
      this.errorMessage = 'Start Time and End Time cannot be the same';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      this.endTime = '--:--';
    }
  }

  setTime() {
    this.endTime = this.startTime;
    console.log(this.startTime);
    console.log(this.endTime);
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  applyTimeSheet(userData: any) {
    this.UserService.addTimeSheet(userData).subscribe(
      (response: any) => {
        this.successMessage = 'Timesheet updated Successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        if (error.status == 400) {
          this.errorMessage = 'An error occurred while adding the user';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          console.log('added');
          this.errorMessage = 'An error occurred while adding the user';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        }
      }
    );
  }

  loadUsers(currentPage: number): void {
    this.subscriptions.push(
      this.UserService.getAllUsers(currentPage, this.resultSize).subscribe(
        (us: User[]) => {
          this.users.push(...us);
          this.dataSource.data = this.users;
          if (this.users.length <= 0 && this.resultPage === 1)
            if (this.users.length <= 0) this.hasMoreResult = false;
          this.fetchingResult = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error.error.message);
        }
      )
    );
  }

  loadMoreUsers(): void {
    this.isLoading = true;
    this.loadUsers(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  navigateToTs(data: Number) {
    this.router.navigate(['/timesheet', { eId: JSON.stringify(data) }], {
      relativeTo: this.route,
      queryParams: { eId: { data } },
    });
  }

  loadTimeSheet(currentPage: Number, resultSize: Number, eId: Number) {
    this.isLoading = true;
    this.subscriptions.push(
      this.UserService.getTimeSheetByEmpId(
        currentPage,
        resultSize,
        eId
      ).subscribe(
        (t: Time[]) => {
          this.timeSheets.push(...t);
          this.dataSourceForUser.data = this.timeSheets;
          this.hasMoreResult = t.length === resultSize;
          this.isLoading = false;
          this.resultPage++;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      )
    );
  }

  loadMoreTimeSheet(): void {
    this.isLoading = true;
    this.loadTimeSheet(this.resultPage, this.resultSize, this.eId);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  isFormEmpty(formData: any): boolean {
    // Check if any form field is empty
    return (
      !formData.startTime ||
      !formData.endTime ||
      !formData.date ||
      !formData.projectId ||
      !formData.note
    );
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;

    // Custom filtering logic to match initial pattern
    if (value) {
      this.dataSource.filterPredicate = (data: User, filter: string) => {
        const fieldsToCheck = [
          data.userId?.toString(), // Convert userId to string
          data.firstName?.toLowerCase(),
          data.lastName?.toLowerCase(),
          data.designation?.toLowerCase(),
          data.dept?.deptName?.toLowerCase(), // Assuming 'dept' has a property 'deptName'
        ];

        // Check if any field starts with the filter value
        return fieldsToCheck.some((field) => {
          const fieldValue = field?.toLowerCase();
          return fieldValue && fieldValue.startsWith(filter);
        });
      };
    } else {
      // Reset filter if search input is empty
      this.dataSource.filterPredicate = (data: User, filter: string) => true; // Default predicate that always returns true
    }
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  navigateBack(time: Time) {
    // Implement your navigation logic here, for example:
    // Assuming you have a route set up for viewing details of a time entry
    this.router.navigate(['/time']); // Replace '/time' with your actual route
  };


  getProjects () {
    this.UserService.getProjects().subscribe((data)=>{
        this.timeSheetData = data;
        console.table(this.timeSheetData);
    })
  }

}
