import { Component } from '@angular/core';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.css']
})
export class JobTitleComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  displayedColumns: string[] = ['jobTitle', 'jobDesc' ,'action'];
  dataSource = [
    { jobTitle: 'Software Engineer' },
    { jobTitle: 'Product Manager' },
    // Add more job titles as needed
  ];
}
