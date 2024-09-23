import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;

  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }
}
