import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-dash-item-dialog",
  templateUrl: "./edit-dash-item-dialog.component.html",
  styleUrls: ["./edit-dash-item-dialog.component.scss"],
})
export class EditDashItemDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  save() {}
  cancel() {}
}
