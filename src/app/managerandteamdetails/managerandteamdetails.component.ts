import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-managerandteamdetails',
  templateUrl: './managerandteamdetails.component.html',
  styleUrls: ['./managerandteamdetails.component.css'],
})
export class ManagerandteamdetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ManagerandteamdetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: 'team' | 'managers'; items: string[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
