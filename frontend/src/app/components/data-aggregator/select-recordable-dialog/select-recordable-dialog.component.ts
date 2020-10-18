import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { IGraphNode } from "@cxss/interfaces";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GraphSelectorComponent } from "../../graph-selector/graph-selector.component";

@Component({
  selector: "app-select-recordable-dialog",
  templateUrl: "./select-recordable-dialog.component.html",
  styleUrls: ["./select-recordable-dialog.component.scss"],
})
export class SelectRecordableDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      graph: IGraphNode[];
      flatGraph: { [index: string]: IGraphNode };
    },
    private dialogRef: MatDialogRef<SelectRecordableDialogComponent>
  ) {}

  @ViewChild("selector") selector: GraphSelectorComponent;

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close([]);
  }

  save() {
    this.dialogRef.close(
      this.selector.getSelection().reduce((acc, curr) => {
        let n = Object.values(this.data.flatGraph).find(
          (n) => n._id == curr._id
        );
        if (n) return [...acc, `${n.type}-${n._id}`];
        return acc;
      }, [])
    );
  }
}
