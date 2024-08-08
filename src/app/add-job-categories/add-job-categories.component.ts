import { Component } from '@angular/core';

@Component({
  selector: 'app-add-job-categories',
  templateUrl: './add-job-categories.component.html',
  styleUrls: ['./add-job-categories.component.css']
})
export class AddJobCategoriesComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
