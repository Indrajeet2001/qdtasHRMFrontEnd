import { Component } from '@angular/core';

@Component({
  selector: 'app-emp-status',
  templateUrl: './emp-status.component.html',
  styleUrls: ['./emp-status.component.css']
})
export class EmpStatusComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  displayedColumns: string[] = ['empStatus', 'action'];
  dataSource = [
    { empStatus: 'Freelancer' },
    { empStatus: 'Full-time' },
    { empStatus: 'Part-time' },
    // Add more job titles as needed
  ];
}
