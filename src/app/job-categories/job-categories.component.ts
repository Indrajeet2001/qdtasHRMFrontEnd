import { Component } from '@angular/core';

@Component({
  selector: 'app-job-categories',
  templateUrl: './job-categories.component.html',
  styleUrls: ['./job-categories.component.css']
})
export class JobCategoriesComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  displayedColumns: string[] = ['jobCat',  'action'];
  dataSource = [
    { jobTitle: 'IT staff' },
    { jobTitle: 'Office workers' },
  ];
}
