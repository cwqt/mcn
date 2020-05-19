import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditDeviceModalComponent } from '../edit-device-modal/edit-device-modal.component';

import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { IDeviceStub, IDevice, DeviceState } from '../../../../../../../../backend/lib/models/Device.model';
import { IMeasurementModel } from '../../../../../../../../backend/lib/models/Measurement.model';
import {
  HardwareInformation,
  HardwareDevice } from '../../../../../../../../backend/lib/common/types/hardware.types';
import { MatExpansionPanel } from '@angular/material/expansion';

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
  @Input() mini:boolean;

  @ViewChild('deviceInfoPanel') deviceInfoPanel:MatExpansionPanel;
  @ViewChild('latestMeasurementsPanel') latestMeasurementsPanel:MatExpansionPanel;

  cache = {
    device: {
      data: undefined,
      loading: false,
      error: ""
    },
    latest_data: {
      data: undefined,
      loading: false,
      error: ""
    }
  }

  deviceInfo:HardwareDevice;
  deviceState:IDeviceState;
  iconMap = {
    [DeviceState.Active]:"signal_cellular_4_bar",
    [DeviceState.InActive]:"signal_cellular_off",
    [DeviceState.UnVerified]:"signal_cellular_connected_no_internet_4_bar"
  }

  constructor(private router:Router,
    private deviceService:DeviceService,
    private dialog:MatDialog) {}

  ngOnInit(): void {
    this.deviceState = {
      active: true,
      verified: true,
      text: "",
      icon:""
    } as IDeviceState

    this.deviceInfo = HardwareInformation[this.device.hardware_model];
    this.deviceState.text = this.device.state;
    this.deviceState.icon = this.iconMap[this.deviceState.text]
  }

  openEditDeviceDialog():void {
    const dialogRef = this.dialog.open(EditDeviceModalComponent, {
      width: '50%',
      data: this.device
    });
  }

  getDeviceMeta() {
    if(!this.cache.device.data) {
      this.deviceInfoPanel.toggle() 
      this.cache.device.loading = true;
      this.cache.device.error = "";
      setTimeout(() => {
        this.deviceService.getDevice(this.profileUser._id, this.device._id)
        .then((device:IDevice) => {
          this.cache.device.data = device;
          this.deviceInfoPanel.open();
        })
        .catch(e => this.cache.device.error = e.error.message)
        .finally(() => this.cache.device.loading = false)
      }, 1000);
    }
  }

  getLatestData() {
    if(!this.cache.latest_data.data) {
      this.cache.latest_data.loading = true;

      this.deviceService.getLatestMeasurement(this.profileUser._id, this.device._id)
        .then((measurement:IMeasurementModel) => this.cache.latest_data.data = measurement[0])
        .catch(e => this.cache.latest_data.error = e)
        .finally(() => this.cache.latest_data.loading = false)
    }
  }

  requestLatestData() {
    // this.deviceService.requestMeasurementsUpdate(this.profileUser._id, this.device._id)
    //   .then((measurement:IMeasurementModel) => this.cache.latest_data.data = measurement[0])
    //   .catch(e => this.cache.latest_data.error = e)
    //   .finally(() => this.cache.latest_data.loading = false)
  }

  gotoDevice() {
    this.router.navigate([`/${this.currentUser.username}/devices/${this.device._id}`])
  }

  openEditDialog() {

  }
}
