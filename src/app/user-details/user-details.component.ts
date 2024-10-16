import { Component } from '@angular/core';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/userServices';
import { HttpClient } from '@angular/common/http';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  userId: any;
  userDetails: any;
  sideNavStatus: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  u!: User;
  uId: any;
  isFormSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  isMale(): string {
    if (this.userDetails && this.userDetails.gender) {
      const gender = this.userDetails.gender.toLowerCase();
      if (gender === 'male') {
        return './assets/images/male.png';
      } else if (gender === 'female') {
        return './assets/images/female.png';
      } else {
        return './assets/images/default.png';
      }
    } else {
      return './assets/images/default.png';
    }
  }

  saveEmployee() {
    this.isFormSubmitted = true;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUserById(this.userId);
  }

  isSidebarExpanded: boolean = true;

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openEidtUser(uId: number): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '700px',
      data: uId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.successMessage = 'Updated Successfully';
        window.location.reload();
      } else if (result == 'failure') {
        this.errorMessage = 'Could not update';
      }
    });
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  getUserById(userId: number) {
    this.userService.getUsersById(userId).subscribe((data) => {
      this.userDetails = data;
    });
  }
}
