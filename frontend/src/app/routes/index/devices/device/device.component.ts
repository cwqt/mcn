import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceService } from "src/app/services/device.service";
import { UserService } from "src/app/services/user.service";
import {
  IDevice,
  HardwareDevice,
  IUser,
  HardwareInformation,
} from "@cxss/interfaces";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { runInThisContext } from "vm";

@Component({
  selector: "app-device",
  templateUrl: "./device.component.html",
  styleUrls: ["./device.component.scss"],
})
export class DeviceComponent implements OnInit {
  deviceInfo: HardwareDevice;
  currentUser: IUser;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  cache = {
    device: {
      data: undefined,
      loading: false,
      error: "",
    },
    measurements: {
      data: undefined,
      loading: false,
      error: "",
    },
    control: {
      data: undefined,
      loading: false,
      error: "",
    },
    routines: {
      data: undefined,
      loading: false,
      error: "",
    },
    propAssignments: {
      data: undefined,
      loading: false,
      error: "",
    },
    status: {
      data: undefined,
      loading: false,
      error: "",
    },
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private deviceService: DeviceService
  ) {}

  get device(): IDevice {
    return this.cache.device.data;
  }

  async ngOnInit() {
    this.currentUser = this.userService.currentUserValue;

    this.route.params
      .subscribe(async (params) => {
        await this.getDevice(params.did);
        // this.getDeviceStatus(params.did);
        await this.getPropAssignmentsGraph(params.did);
        // this.getDeviceMeasurements();
        // this.getDeviceSensors();
        this.cache.device.loading = false;
      })
      .unsubscribe();
  }

  getDevice(device_id: string): Promise<IDevice> {
    this.cache.device.loading = true;
    return this.deviceService
      .getDevice(device_id)
      .then((device: IDevice) => {
        this.deviceInfo = HardwareInformation[device.hardware_model];
        this.cache.device.data = device;
      })
      .catch((e) => (this.cache.device.error = e))
      .finally(() => (this.cache.device.loading = false));
  }

  getDeviceStatus(device_id: string) {
    this.cache.status.loading = true;
    return this.deviceService
      .getDeviceStatus(device_id)
      .then((res) => {
        let x = [];
        res.forEach((r) => {
          r.rows = r.rows.filter((x) => x.value != null);
          if (r.rows.length) x.push(r);
        });
        this.cache.status.data = x;
      })
      .catch((e) => (this.cache.status.error = e))
      .finally(() => (this.cache.status.loading = false));
  }

  getPropAssignmentsGraph(device_id: string) {
    this.cache.propAssignments.loading = true;
    return this.deviceService
      .getPropertyAssignmentsGraph(device_id)
      .then((res) => {
        console.log(res);
        this.cache.propAssignments.data = res;
      })
      .catch((e) => (this.cache.propAssignments.error = e))
      .finally(() => (this.cache.propAssignments.loading = false));
  }
}
