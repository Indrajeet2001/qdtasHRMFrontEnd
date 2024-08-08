import { Component } from '@angular/core';

@Component({
  selector: 'app-workshifts',
  templateUrl: './workshifts.component.html',
  styleUrls: ['./workshifts.component.css']
})
export class WorkshiftsComponent {
  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  displayedColumns: string[] = ['worktime', 'from', 'to', 'total', 'action'];
  dataSource = [
    {
      worktime: 'Day Shift',
      from: '10:00 AM',
      to: '06:00 PM',
      total: '08:00 hours',
    },

  ];
}
