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
      })
      .catch((e) => (this.devices.error = e))
      .finally(() => (this.devices.loading = false));
  }

  openDeviceDetail(device: IDeviceStub) {
    this.router.navigate([`/devices/${device._id}`]);
  }
}
