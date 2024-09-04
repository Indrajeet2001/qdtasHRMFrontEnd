import { Component } from '@angular/core';

@Component({
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.css'],
})
export class LeaveReportComponent {
  isSidebarExpanded: boolean = true;
  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
