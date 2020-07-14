import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceService } from "src/app/services/device.service";
import { UserService } from "src/app/services/user.service";
import {
  IDevice,
  IDeviceSensor,
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
      loading: true,
      error: "",
    },
    sensors: {
      data: undefined,
      loading: true,
      error: "",
    },
    user: {
      data: undefined,
      loading: true,
      error: "",
    },
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private deviceService: DeviceService
  ) {}

  get user(): IUser {
    return this.cache.user.data;
  }
  get device(): IDevice {
    return this.cache.device.data;
  }

  async ngOnInit() {
    this.currentUser = this.userService.currentUserValue;

    this.route.params
      .subscribe(async (params) => {
        this.cache.user.data = this.userService.currentUserValue;
        // await this.getDevice(params.did);
        // this.getDeviceMeasurements();
        // this.getDeviceSensors();
        this.cache.device.data = {
          thumbnail:
            "https://cdn.discordapp.com/attachments/264522461943562244/704820132312252426/IMG_0028.JPG",
          images: [],
          last_ping: 1592687507507.0,
          measurement_count: 6.0,
          name: "Model 1",
          network_name: "mcn-wd1m",
          created_at: 1592159241286.0,
          short_desc:
            "This is my prototype device, featuring a DHT22 temp/humidity sensor, VEML7700 i²c photometer & 1 corrosion resistant capacitative moisture sensor",
          _id: "5ee66c09161c3e5284e3f67d",
          state: "unverified",
          hardware_model: "mcn_wemos_d1_mini",
        };
        this.cache.device.loading = false;
      })
      .unsubscribe();
  }

  getUser(username: string): Promise<IUser> {
    this.cache.user.loading = true;
    return this.userService
      .getUserByUsername(username)
      .then((user) => (this.cache.user.data = user))
      .catch((e) => (this.cache.user.error = e))
      .finally(() => (this.cache.user.loading = false));
  }

  getDevice(device_id: string): Promise<IDevice> {
    this.cache.device.loading = true;
    return this.deviceService
      .getDevice(this.cache.user.data._id, device_id)
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

  getDeviceSensors(): Promise<IDeviceSensor[]> {
    this.cache.sensors.loading = true;
    return this.deviceService
      .getDeviceSensors(this.cache.user.data._id, this.cache.device.data._id)
      .then((sensors: IDeviceSensor[]) => {
        //group by measurement type
        let res = {};
        sensors.forEach((s: IDeviceSensor) => {
          if (!res[s.measures]) {
            res[s.measures] = [s];
          } else {
            res[s.measures].push(s);
          }
        });

        this.cache.sensors.data = res;
      })
      .catch((e) => (this.cache.sensors.error = e))
      .finally(() => (this.cache.sensors.loading = false));
  }

  // goToAssignedRecordable() {
  //   this.router.navigate([
  //     `/${this.cache.user.data.username}/${this.device.assigned_to.type}s/${this.device.assigned_to._id}`,
  //   ]);
  // }

  tags = ["Device", "I<3Plants", "Wemos D1 Mini"];

  addTag(tag: string) {}
  removeTag(tag: string) {}
}
