import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import { IDevice, IDeviceStub, IDeviceState, IDeviceSensor } from '../../../../../backend/lib/models/Device/Device.model';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { PlantService } from 'src/app/services/plant.service';
import { HardwareDevice } from '../../../../../backend/lib/models/Hardware.model';
import { IUser } from '../../../../../backend/lib/models/User.model';
import { HardwareInformation } from '../../../../../backend/lib/common/types/hardware.types';

import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  deviceInfo:HardwareDevice;
  currentUser:IUser;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  cache = {
    device: {
      data: undefined,
      loading: true,
      error: ""
    },
    measurements: {
      data: undefined,
      loading: true,
      error: ""
    },
    sensors: {
      data: undefined,
      loading: true,
      error: ""
    },
    user: {
      data: undefined,
      loading: true,
      error: ""
    },
  }
  
  constructor(private route:ActivatedRoute,
    private userService:UserService,
    private router:Router,
    private plantService:PlantService,
    private deviceService:DeviceService) {
  }

  get user():IUser { return this.cache.user.data }
  get device():IDevice { return this.cache.device.data }
  get measurements():IMeasurementModel[] { return this.cache.measurements.data }

  async ngOnInit() {
    this.currentUser = this.userService.currentUserValue;

    this.route.params.subscribe(async (params) => {
      await this.getUser(params.username)
      await this.getDevice(params.did)
      this.getDeviceMeasurements();
      this.getDeviceSensors();
    }).unsubscribe();
  }

  getUser(username:string):Promise<IUser> {
    this.cache.user.loading = true;
    return this.userService.getUserByUsername(username)
      .then(user => this.cache.user.data = user)
      .catch(e => this.cache.user.error = e)
      .finally(() => this.cache.user.loading = false)
  }

  getDevice(device_id:string):Promise<IDevice> {
    this.cache.device.loading = true;
    return this.deviceService.getDevice(this.cache.user.data._id, device_id)
      .then((device:IDevice) => {
        this.deviceInfo = HardwareInformation[device.hardware_model];
        this.cache.device.data = device;
      })
      .catch(e => this.cache.device.error = e)
      .finally(() => this.cache.device.loading = false)
  }

  getDeviceMeasurements():Promise<IMeasurementModel[]> {
    this.cache.measurements.loading = true;
    return this.deviceService.getMeasurements(this.cache.user.data._id, this.cache.device.data._id)
      .then((measurements:IMeasurementModel[]) => this.cache.measurements.data = measurements)
      .catch(e => this.cache.measurements.error = e)
      .finally(() => this.cache.measurements.loading = false)
  }

  getDeviceSensors():Promise<IDeviceSensor[]> {
    this.cache.sensors.loading = true;
    return this.deviceService.getDeviceSensors(this.cache.user.data._id, this.cache.device.data._id)
      .then((sensors:IDeviceSensor[]) => {
        //group by measurement type
        let res = {};          
        sensors.forEach((s:IDeviceSensor) => {
          if(!res[s.measures]) {
            res[s.measures] = [s];
          } else {
            res[s.measures].push(s)
          }
        })

        this.cache.sensors.data = res;
      })
      .catch(e => this.cache.sensors.error = e)
      .finally(() => this.cache.sensors.loading = false)
  }

  goToAssignedRecordable() {
    this.router.navigate([`/${this.cache.user.data.username}/${this.device.assigned_to.type}s/${this.device.assigned_to._id}`]);
  }

  tags = ["Device", "I<3Plants", "Wemos D1 Mini"];

  addTag(tag:string) {}
  removeTag(tag:string) {}
}
