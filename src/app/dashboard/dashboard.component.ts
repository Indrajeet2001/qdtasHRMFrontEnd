import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { Leave } from '../model/leave';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private UserService: UserService, private router: Router) {}
  successMessage: string | null = null;
  errorMessage: string | null = null;
  leaves: Leave[] = [];
  resultPage: number = 1;
  resultSize: number = 10;
  hasMoreResult: boolean = true;
  fetchingResult: boolean = false;
  private subscriptions: Subscription[] = [];
  leave: any;
  isSidebarExpanded: boolean = true;
  pendingCount: number = 0;
  pendingLeaves: any;
  isVisible: boolean = false;

  ngOnInit(): void {
    this.loadLeaves(this.resultPage);
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  loadLeaves(currentPage: number) {
    this.subscriptions.push(
      this.UserService.getAllLeaves(currentPage, this.resultSize).subscribe(
        (l: Leave[]) => {
          this.leaves = [...l, ...this.leaves];
          this.leave = this.leaves;
          this.leave = this.leaves;
          this.pendingCount = this.leave.filter(
            (leave: any) => leave.status === 'PENDING'
          ).length;

          this.pendingLeaves = this.leave.filter(
            (leave: any) => leave.status === 'PENDING'
          );
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

  showNotifications() {
    this.router.navigate(['/leave']);
  }
  toggleVisibility() {
    if (this.pendingLeaves.length > 3) {
      this.router.navigate(['/leave']); 
    } else {
      this.isVisible = !this.isVisible;
    }
  }
}
