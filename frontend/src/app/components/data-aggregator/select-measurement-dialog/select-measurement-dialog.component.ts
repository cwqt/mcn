import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  IMeasurementInfo,
  Measurement,
  IoTMeasurement,
  IoTState,
} from "@cxss/interfaces";
import { MatSelectionList } from "@angular/material/list";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-select-measurement-dialog",
  templateUrl: "./select-measurement-dialog.component.html",
  styleUrls: ["./select-measurement-dialog.component.scss"],
})
export class SelectMeasurementDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      [index in Measurement | IoTMeasurement | IoTState]: IMeasurementInfo;
    },
    private dialogRef: MatDialogRef<SelectMeasurementDialogComponent>
  ) {}

  selection = new SelectionModel<IMeasurementInfo>(false);

  ngOnInit(): void {}

  selectMeasurement(measurement: IMeasurementInfo) {
    this.selection.select(measurement);
  }

  cancel() {
    this.dialogRef.close([]);
  }

  save() {
    this.dialogRef.close();
  }
}
