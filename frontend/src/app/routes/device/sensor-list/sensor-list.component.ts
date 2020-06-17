import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { IDevice, IDeviceStub, IDeviceState, IDeviceSensor } from '../../../../../../backend/lib/models/Device/Device.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  @Input() sensors:{[index:string]:IDeviceSensor[]}

  cachedSensorData:{[index:string]:any}//ref: data

  options = {
    "axes": {
      "bottom": {
        "mapsTo": "date",
        "scaleType": "time"
      },
      "left": {
        "mapsTo": "value",
        "scaleType": "linear"
      }
    },
    "curve": "curveNatural",
    "height": "400px"
  }

  constructor(private deviceService:DeviceService) { }

  ngOnInit(): void {
    Object.values(this.sensors).forEach(type => {
      type.forEach((sensor:IDeviceSensor) => {
        this.cachedSensorData[sensor.ref] = {
          loading: false,
          error: "",
          data: {}
        }
      })
    })
  }

  getSensorData(ref:string):Promise<IDevicePropertyData> {
    this.cachedSensorData[ref].loading = true;
    return this.deviceService.getPropertyData(this.authorUser._id, this.device._id, ref)
      .then(() => {})
      .catch(e => {
        this.cachedSensorData[ref].error = e;
      })
      .finally(() => this.cachedSensorData[ref].loading = false);
  }
}
