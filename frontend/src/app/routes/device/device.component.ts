import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import { IDevice } from '../../../../../backend/lib/models/Device.model';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { PlantService } from 'src/app/services/plant.service';
import {
  HardwareInformation,
  HardwareDevice } from '../../../../../backend/lib/common/types/hardware.types';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  user_id:string;
  device_id:string;
  deviceInfo:HardwareDevice;

  cache = {
    device: {
      data: {} as IDevice,
      loading: true,
      error: ""
    },
    measurements: {
      data: [] as IMeasurementModel[],
      loading: true,
      error: ""
    }
  }
  
  constructor(private route:ActivatedRoute,
    private router:Router,
    private plantService:PlantService,
    private deviceService:DeviceService) {
  }

  get device():IDevice {
    return this.cache.device.data;
  }

  get measurements():IMeasurementModel[] {
    return this.cache.measurements.data;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.user_id = params.username
      this.device_id = params.did
      this.getDevice().then(() => {
        this.deviceInfo = HardwareInformation[this.cache.device.data.hardware_model];
        console.log(this.cache.device.data, this.deviceInfo)
        this.getDeviceMeasurements();
      })
    });
  }

  getDevice() {
    this.cache.device.loading = true;
    return this.deviceService.getDevice(this.user_id, this.device_id)
      .then((device:IDevice) => this.cache.device.data = device)
      .catch(e => this.cache.device.error = e)
      .finally(() => this.cache.device.loading = false)
  }

  getDeviceMeasurements() {
    this.cache.measurements.loading = true;
    this.deviceService.getMeasurements(this.user_id, this.cache.device.data._id)
      .then((measurements:IMeasurementModel[]) => this.cache.measurements.data = measurements)
      .catch(e => this.cache.measurements.error = e)
      .finally(() => this.cache.measurements.loading = false)
  }

  goToAssignedRecordable() {
    this.router.navigate([`/${this.user_id}/${this.device.assigned_to.type}s/${this.device.assigned_to._id}`]);
  }
}
