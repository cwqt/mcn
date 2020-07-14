import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import moment from "moment";

import { IDeviceStub, IDeviceSensor } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";

@Component({
  selector: "app-device-list",
  templateUrl: "./device-list.component.html",
  styleUrls: ["./device-list.component.scss"],
})
export class DeviceListComponent implements OnInit {
  @Output() selectedDevice: EventEmitter<IDeviceStub> = new EventEmitter();

  devices = {
    data: <IDeviceStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["name", "_id", "last_ping", "state"],
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
        console.log(devices);
      })
      .catch((e) => (this.devices.error = e))
      .finally(() => (this.devices.loading = false));
  }

  openDeviceDetail(device: IDeviceStub) {
    this.selectedDevice.emit(device);
  }
}
