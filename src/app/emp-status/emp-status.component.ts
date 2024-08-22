import { Component } from '@angular/core';
import {Subscription} from "rxjs";
import {EmpStatus} from "../model/empStatus";
import {User} from "../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../service/userServices";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-emp-status',
  templateUrl: './emp-status.component.html',
  styleUrls: ['./emp-status.component.css']
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
  displayedColumns: string[] = [ 'employmentStatusName','action'];
  dataSource: MatTableDataSource<EmpStatus>;

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
    this.loadJobs(this.resultPage);
  }

  ngAfterViewInit() {
  }

  isSidebarExpanded: boolean = true;

  loadJobs(currentPage: number): void {
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
}
