import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-empstatus',
  templateUrl: './edit-empstatus.component.html',
  styleUrls: ['./edit-empstatus.component.css'],
})
export class EditEmpstatusComponent {
  jobId!: any;
  jobData: any = {}; // Initialize jobData as an empty object

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<EditEmpstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // console.log(this.data);
    this.jobId = this.data.jobId;
    this.loadEmpStatus(this.jobId);
    // alert(this.jobId);
  }

  loadEmpStatus(jobId: number) {
    this.userService.getEmpStatusById(jobId).subscribe(
      (res) => {
        console.log(res); // Log the response to check structure
        this.jobData = res; // Assign based on structure
      },
      (error) => {
        console.error('Error fetching job data:', error);
      }
    );
  }

  updateEmpStatus(data: any) {
    this.userService.updateEmpStatus(this.jobId, data).subscribe(
      (res: any) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error: any) => {
        setTimeout(() => {
        }, 3000);
      }
    );
  }

  dismissDialogBox() {
    this.dialogRef.close();
  }
}
