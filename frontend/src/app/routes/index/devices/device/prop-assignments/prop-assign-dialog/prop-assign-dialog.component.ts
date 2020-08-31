import { Component, OnInit, Inject } from "@angular/core";
import { DeviceService } from "src/app/services/device.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IFlorableGraph } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: "app-prop-assign-dialog",
  templateUrl: "./prop-assign-dialog.component.html",
  styleUrls: ["./prop-assign-dialog.component.scss"],
})
export class PropAssignDialogComponent implements OnInit {
  loading: boolean = false;
  error: string = "";
  florableGraph: any;

  initialRecordableId: string;
  selectedRecordable: any;

  constructor(
    private orgService: OrganisationService,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<PropAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    await this.getFlorableGraph();
    console.log(this.data);
    this.initialRecordableId = this.data.recordable.split("-")[1];
    this.selectedRecordable = {
      ...this.data.sources[this.data.recordable],
      //repack _id and type into node from key
      _id: this.data.recordable.split("-")[1],
      type: this.data.recordable.split("-")[0],
    };
  }

  async getFlorableGraph() {
    this.loading = true;
    return this.orgService
      .getFlorableGraph()
      .then((g: any) => {
        //map into tree
        g.farms.forEach((f) => {
          f.children = f.racks;
          f.children.forEach((r) => {
            r.children = r.crops;
          });
        });
        this.florableGraph = g;
      })
      .catch((e) => (this.error = e.message))
      .finally(() => (this.loading = false));
  }

  selectRecordable(node) {
    this.selectedRecordable = node ? Object.assign({}, node) : null;
  }

  assign() {
    this.loading = true;
    this.deviceService
      .assignManyProperties(this.data.device._id, {
        [this.data.property]: this.selectedRecordable
          ? `${this.selectedRecordable.type}-${this.selectedRecordable._id}`
          : null,
      })
      .then(() => {
        setTimeout(() => {
          this.dialogRef.close(this.selectedRecordable);
        }, 250);
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
