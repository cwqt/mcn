import { Component, OnInit } from "@angular/core";
import moment from "moment";

import { IDeviceStub } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import {
  TableItem,
  TableModel,
  TableHeaderItem,
} from "carbon-components-angular";

@Component({
  selector: "app-device-list",
  templateUrl: "./device-list.component.html",
  styleUrls: ["./device-list.component.scss"],
})
export class DeviceListComponent implements OnInit {
  devices = {
    data: <IDeviceStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    model: new TableModel(),
  };

  model: any;

  constructor(private orgService: OrganisationService) {}

  ngOnInit(): void {
    console.log("getting devices");
    this.devices.loading = true;
    this.orgService
      .getDevices()
      .then((devices) => {
        this.devices.data = devices;
        this.devices.model.header = [
          new TableHeaderItem({ data: "Device" }),
          new TableHeaderItem({ data: "_id" }),
          new TableHeaderItem({ data: "Last ping" }),
          new TableHeaderItem({ data: "State" }),
        ];
        this.devices.model.data = this.compileIbmTable(devices);
      })
      .catch((e) => (this.devices.error = e))
      .finally(() => (this.devices.loading = false));
  }

  compileIbmTable(devices: IDeviceStub[]): Array<TableItem[]> {
    //device name | _id | last_ping | state

    let modelData: Array<TableItem[]> = [];
    devices.forEach((d: IDeviceStub) => {
      let row: TableItem[] = [];
      row.push(new TableItem({ data: d.name }));
      row.push(new TableItem({ data: d._id }));
      row.push(new TableItem({ data: moment.unix(d.last_ping).fromNow() }));
      row.push(new TableItem({ data: d.state }));
      modelData.push(row);
    });

    return modelData;
  }
}
