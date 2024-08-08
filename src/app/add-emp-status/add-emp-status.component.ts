import { Component } from '@angular/core';

@Component({
  selector: 'app-add-emp-status',
  templateUrl: './add-emp-status.component.html',
  styleUrls: ['./add-emp-status.component.css']
})
export class AddEmpStatusComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
