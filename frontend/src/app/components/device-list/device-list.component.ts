import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import moment from "moment";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { IDeviceStub, Paginated } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { Router } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-device-list",
  templateUrl: "./device-list.component.html",
  styleUrls: ["./device-list.component.scss"],
})
export class DeviceListComponent implements OnInit {
  selectedId: string;
  selection = new SelectionModel<IDeviceStub>(true, []);
  dataSource = new MatTableDataSource<IDeviceStub>();

  devices = {
    data: <IDeviceStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["select", "name", "_id", "last_ping", "state"],
  };

  constructor(
    private orgService: OrganisationService,
    private router: Router
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
