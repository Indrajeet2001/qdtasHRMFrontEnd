import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { Recruitment } from '../model/recruitment';
import { UserService } from '../service/userServices';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-recruitment',
  templateUrl: './edit-recruitment.component.html',
  styleUrls: ['./edit-recruitment.component.css'],
})
export class EditRecruitmentComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  jobTitle: any;
  departments: any;
  fullName: any[] = [];
  resultSizeForUser = 1000;
  private subscriptions: Subscription[] = [];
  users: User[] = [];
  u!: User;
  recruitment: Recruitment[] = [];
  isLoggedIn!: User;
  isLoading: boolean = false;
  resultSize: number = 10;
  fetchingResult: boolean = false;
  resultPage: number = 1;
  hasMoreResult: boolean = true;
  recruitmentId!: any;
  public Data: any = { job: {}, user: {} };

  constructor(
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<EditRecruitmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.getJobs();
    const currentPage = 1;
    this.loadHiringManager(currentPage);
    this.recruitmentId = this.data.rId;
    this.loadRecruitments(this.recruitmentId);
  }

  getJobs() {
    this.userService.getAllJobTitle().subscribe((data) => {
      this.jobTitle = data;
    });
  }

  loadHiringManager(selectedPage: number): void {
    this.subscriptions.push(
      this.userService
        .getAllUsers(selectedPage, this.resultSizeForUser)
        .subscribe(
          (users: User[]) => {
            this.users = users;

            this.fullName = this.users.map((user) => ({
              userId: user.userId,
              fullName: user.firstName + ' ' + user.lastName,
            }));
          },
          (error) => {
            console.log(error.error.message);
          }
        )
    );
  }

  loadRecruitments(Id: number) {
    this.userService.getRecruitmentById(Id).subscribe(
      (res) => {
        this.Data = res;
      },
      (error) => {
        console.error('Error fetching job data:', error);
      }
    );
  }

  updateRecruitment(data: any) {
    this.userService.updateRecruitment(this.recruitmentId, data).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.successMessage = 'Recruitment updated Successfully';
          window.location.reload();
        }, 1000);
      },
      (error: any) => {
        this.errorMessage = 'Could not update Recruitment';
      }
    );
  }

  dismissDialogBox() {
    this.dialogRef.close();
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;

  }
}
