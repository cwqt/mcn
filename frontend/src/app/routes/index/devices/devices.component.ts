import { Component, OnInit } from "@angular/core";

import { IDeviceStub, Paginated } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-devices",
  templateUrl: "./devices.component.html",
  styleUrls: ["./devices.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class DevicesComponent implements OnInit {
  selectedId: string;
  selection = new SelectionModel<IDeviceStub>(true, []);
  dataSource = new MatTableDataSource<IDeviceStub>();

  devices = {
    data: <IDeviceStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["select", "name", "_id", "last_ping", "state"],
  };

  expandedElement: IDeviceStub;

  constructor(
    private orgService: OrganisationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.devices.loading = true;
    this.orgService
      .getDevices()
      .then((paginated: Paginated<IDeviceStub>) => {
        this.devices.data = paginated.results;
        this.dataSource = new MatTableDataSource<IDeviceStub>(
          this.devices.data
        );

        this.route.firstChild.params.subscribe((params) => {
          this.expandedElement = this.devices.data.find(
            (d) => d._id == params.did
          );
        });
      })
      .catch((e) => (this.devices.error = e))
      .finally(() => (this.devices.loading = false));
  }

  openDeviceDetail(device: IDeviceStub) {
    this.selectedId = device._id;
    this.router.navigate([`/devices/${device._id}`]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IDeviceStub): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row`;
  }
}
