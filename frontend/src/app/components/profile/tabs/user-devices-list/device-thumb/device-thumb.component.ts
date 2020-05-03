import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';

import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { IDeviceStub, IDevice } from '../../../../../../../../backend/lib/models/Device.model';
import { IMeasurementModel } from '../../../../../../../../backend/lib/models/Measurement.model';
import { ThrowStmt } from '@angular/compiler';

enum DeviceStates {
  Active = "active",
  InActive = "inactive",
  Verified = "verified",
  UnVerified = "unverified"
}

interface IDeviceState {
  active: boolean,
  verified: boolean,
  text: string,
  icon: string,
}

@Component({
  selector: 'app-device-thumb',
  templateUrl: './device-thumb.component.html',
  styleUrls: ['./device-thumb.component.scss']
})
export class DeviceThumbComponent implements OnInit {
  @Input() profileUser:IUser;
  @Input() currentUser:IUser;
  @Input() device:IDeviceStub;

  cache = {
    "device": {
      data: undefined,
      loading: false,
      error: ""
    },
    "latest_data": {
      data: undefined,
      loading: false,
      error: ""
    }
  }

  deviceState:IDeviceState;
  iconMap = {
    [DeviceStates.Active]:"signal_cellular_4_bar",
    [DeviceStates.InActive]:"signal_cellular_off",
    [DeviceStates.UnVerified]:"signal_cellular_connected_no_internet_4_bar"
  }
  meta:undefined;
  latest_data:undefined;

  constructor(private router:Router, private deviceService:DeviceService) {
    this.deviceState = {
      active: true,
      verified: true,
      text: "",
      icon:""
    } as IDeviceState

    this.deviceState.text = this.getStateText();
    this.deviceState.icon = this.iconMap[this.deviceState.text]
  }

  getStateText() {
    if(this.deviceState.verified && this.deviceState.active) return DeviceStates.Active
    if(this.deviceState.verified && !this.deviceState.active) return DeviceStates.InActive
    if(!this.deviceState.verified) return DeviceStates.UnVerified;
  }

  ngOnInit(): void {
  }

  getDeviceMeta() {
    if(!this.cache.device.data) {
      this.cache.device.loading = true;

      this.deviceService.getDevice(this.profileUser._id, this.device._id)
        .then((device:IDevice) => this.cache.device.data = device)
        .catch(e => this.cache.device.error = e)
        .finally(() => this.cache.device.loading = false)
    }
  }

  getLatestData() {
    if(!this.cache.latest_data.data) {
      this.cache.latest_data.loading = true;

      this.deviceService.getLatestMeasurement(this.profileUser._id, this.device._id)
        .then((measurement:IMeasurementModel) => this.cache.latest_data.data = measurement)
        .catch(e => this.cache.latest_data.error = e)
        .finally(() => this.cache.latest_data.loading = false)
    }
  }

  gotoDevice() {
    this.router.navigate([`/${this.currentUser.username}/devices/${this.device._id}`])
  }

  openEditDialog() {
    
  }
}
