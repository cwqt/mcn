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

  // getDeviceMeasurements(): Promise<IMeasurementModel[]> {
  //   this.cache.measurements.loading = true;
  //   return this.deviceService
  //     .getMeasurements(this.cache.user.data._id, this.cache.device.data._id)
  //     .then(
  //       (measurements: IMeasurementModel[]) =>
  //         (this.cache.measurements.data = measurements)
  //     )
  //     .catch((e) => (this.cache.measurements.error = e))
  //     .finally(() => (this.cache.measurements.loading = false));
  // }

  // getDeviceSensors(): Promise<IDeviceSensor[]> {
  //   this.cache.sensors.loading = true;
  //   return this.deviceService
  //     .getDeviceSensors(this.cache.user.data._id, this.cache.device.data._id)
  //     .then((sensors: IDeviceSensor[]) => {
  //       //group by measurement type
  //       let res = {};
  //       sensors.forEach((s: IDeviceSensor) => {
  //         if (!res[s.measures]) {
  //           res[s.measures] = [s];
  //         } else {
  //           res[s.measures].push(s);
  //         }
  //       });

  //       this.cache.sensors.data = res;
  //     })
  //     .catch((e) => (this.cache.sensors.error = e))
  //     .finally(() => (this.cache.sensors.loading = false));
  // }

  // goToAssignedRecordable() {
  //   this.router.navigate([
  //     `/${this.cache.user.data.username}/${this.device.assigned_to.type}s/${this.device.assigned_to._id}`,
  //   ]);
  // }

  tags = ["Device", "I<3Plants", "Wemos D1 Mini"];

  addTag(tag: string) {}
  removeTag(tag: string) {}
}
