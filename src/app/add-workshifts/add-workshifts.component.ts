import { Component } from '@angular/core';

@Component({
  selector: 'app-add-workshifts',
  templateUrl: './add-workshifts.component.html',
  styleUrls: ['./add-workshifts.component.css']
})
export class AddWorkshiftsComponent {
  minDate!: Date;
  startDate!: Date;


  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
