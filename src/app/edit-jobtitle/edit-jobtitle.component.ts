import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-jobtitle',
  templateUrl: './edit-jobtitle.component.html',
  styleUrls: ['./edit-jobtitle.component.css'],
})
export class EditJobtitleComponent implements OnInit {
  jobId!: any;
  jobData: any = {}; // Initialize jobData as an empty object

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<EditJobtitleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.jobId = this.data.jobId;
    this.loadJobs(this.jobId);
    // alert(this.jobId);
  }

  loadJobs(jobId: number) {
    this.userService.getJobById(jobId).subscribe(
      (res) => {
        this.jobData = res;
      },
      (error) => {
        console.error('Error fetching job data:', error);
      }
    );
  }

  updateJob(data: any) {
    this.userService.updateJob(this.jobId, data).subscribe(
      (res: any) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error: any) => {
        setTimeout(() => {}, 3000);
      }
    );
  }

  dismissDialogBox() {
    this.dialogRef.close();
  }
}
