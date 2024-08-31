import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../service/userServices';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-workshifts',
  templateUrl: './edit-workshifts.component.html',
  styleUrls: ['./edit-workshifts.component.css'],
})
export class EditWorkshiftsComponent implements OnInit {
  workId!: any;
  shiftData: any = {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<EditWorkshiftsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.workId = this.data.workId;
    this.loadShifts(this.workId);
  }

  loadShifts(workId: number) {
    this.userService.getWorkshiftById(workId).subscribe(
      (res) => {
        console.log(res); // Log the response to check structure
        this.shiftData = res; // Assign based on structure
      },
      (error) => {
        console.error('Error fetching workshift data:', error);
      }
    );
  }

  updateShifts(data: any) {
    this.userService.updateWorkshift(this.workId, data).subscribe( 
      (res: any) => {
        console.log(data);
        
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

  isEndTimeInvalid(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) {
      return false; // No validation if either value is missing
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    return end <= start; // Returns true if end time is less than or equal to start time
  }
}
