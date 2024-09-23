import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-workshifts',
  templateUrl: './add-workshifts.component.html',
  styleUrls: ['./add-workshifts.component.css'],
})
export class AddWorkshiftsComponent {
  constructor(private userService: UserService, private router: Router) {}
  successMessage: string | null = null;
  errorMessage: string | null = null;
  minDate!: Date;
  startDate!: Date;

  isSidebarExpanded: boolean = true;
  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  addWorkshift(data: any) {
    const token = localStorage.getItem('token');
    this.userService.addWorkshift(data).subscribe(
      (response: any) => {
        this.successMessage = 'Workshift added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding job workshift :', error);
        this.errorMessage =
          error.error?.message ||
          'An error occurred while adding the workshift ';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  goToWorkshift() {
    this.router.navigate(['/work-shifts']);
  }

  isEndTimeInvalid(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) {
    return false; 
  }

  const start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);


  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return end <= start; 
}

}
