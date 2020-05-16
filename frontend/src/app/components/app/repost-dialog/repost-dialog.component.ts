import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordableType } from '../../../../../../backend/lib/models/Recordable.model';


@Component({
  selector: 'app-repost-dialog',
  templateUrl: './repost-dialog.component.html',
  styleUrls: ['./repost-dialog.component.scss']
})
export class RepostDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RepostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {}

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
