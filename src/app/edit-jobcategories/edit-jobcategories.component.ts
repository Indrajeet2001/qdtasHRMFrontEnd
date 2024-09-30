import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-jobcategories',
  templateUrl: './edit-jobcategories.component.html',
  styleUrls: ['./edit-jobcategories.component.css'],
})
export class EditJobcategoriesComponent {
  jobId!: any;
  jobData: any = {}; // Initialize jobData as an empty object

  constructor(
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<EditJobcategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {

    this.jobId = this.data.jobId;
    this.loadJobs(this.jobId);
    // alert(this.jobId);
  }

  loadJobs(jobId: number) {
    this.userService.getJobCategoryById(jobId).subscribe(
      (res) => {
        console.log(res); // Log the response to check structure
        this.jobData = res; // Assign based on structure
      },
      (error) => {
        console.error('Error fetching job data:', error);
      }
    );
  }


  updateJob(data: any) {
    this.userService.updateJobCategory(this.jobId, data).subscribe(
      (res: any) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error: any) => {
        console.error('Error updating job:', error);
      }
    );
  }

  dismissDialogBox() {
    this.dialogRef.close();
  }
}


