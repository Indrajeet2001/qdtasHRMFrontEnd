import { Component } from '@angular/core';
import { UserService } from '../service/userServices';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { Recruitment } from '../model/recruitment';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditRecruitmentComponent } from '../edit-recruitment/edit-recruitment.component';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css'],
})
export class RecruitmentComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  jobTitle: any;
  departments: any;
  fullName: any[] = [];
  selectedTeams = [];
  displayedColumns: String[] = [];
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
  uName: any[] = [];
  dataSource: MatTableDataSource<Recruitment>;

  isSidebarExpanded: boolean = true;
  constructor(private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Recruitment>();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.getAuthUserFromCache();
    this.displayColumns();
    this.getJobs();
    const currentPage = 1;
    this.loadHiringManager(currentPage);
    this.loadRecruitment(this.resultPage);
  }

  onToggleSidebar(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  dismissSuccessMessage() {
    this.successMessage = null;
  }

  dismissErrorMessage() {
    this.errorMessage = null;
  }

  getJobs() {
    this.userService.getAllJobTitle().subscribe((data) => {
      this.jobTitle = data;
      console.table(this.jobTitle);
    });
  }

  displayColumns() {
    if (this.isLoggedIn.role === 'ROLE_USER') {
      this.displayedColumns = ['jobName', 'experience', 'userName', 'status'];
    } else {
      this.displayedColumns = [
        'jobName',
        'experience',
        'userName',
        'status',
        'actions',
      ];
    }
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

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addRecruitment(data: any) {
    const token = localStorage.getItem('token');
    this.userService.addRecruitment(data).subscribe(
      (response: any) => {
        this.successMessage = 'Recruitment added successfully';
        setTimeout(() => {
          this.successMessage = null;
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.error('Error adding Recruitment :', error);
        this.errorMessage =
          error.error?.message ||
          'An error occurred while adding the Recruitment ';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    );
  }

  loadRecruitment(currentPage: number): void {
    this.subscriptions.push(
      this.userService
        .getAllRecruitment(currentPage, this.resultSize)
        .subscribe(
          (jb: Recruitment[]) => {
            this.recruitment = [...jb, ...this.recruitment];
            this.dataSource.data = this.recruitment;
            if (jb.length <= 0) this.hasMoreResult = false;
            this.fetchingResult = false;
            this.resultPage++;
          },
          (error) => {
            console.log(error.error.message);
            this.fetchingResult = false;
          }
        )
    );
  }

  loadMoreRecruitment(): void {
    this.isLoading = true;
    this.loadRecruitment(this.resultPage);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  editRecruitment(rId: number): void {
    const dialogRef = this.dialog.open(EditRecruitmentComponent, {
      width: '900px',
      data: { rId: rId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(rId);

      if (result === 'success') {
        this.successMessage = 'Recruitment updated Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result === 'failure') {
        this.errorMessage = 'Could not update Recruitment';
      }
    });
  }

  deleteRecruitment(rId: number): void {
    this.openConfirmationDialog(rId);
  }

  openConfirmationDialog(rId: number): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteRecruitment(rId).subscribe(
          (response: any) => {
            this.successMessage = 'Recruitment deleted Successfully';
            setTimeout(() => {
              this.successMessage = null;
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.errorMessage = 'Could not recruitment';
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        );
      }
    });
  }
}
