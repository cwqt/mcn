import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { IDevice, IDeviceStub, IDeviceState, IDeviceSensor } from '../../../../../../backend/lib/models/Device/Device.model';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  @Input() sensors:{[index:string]:IDeviceSensor}

  data = [
    {
      "group": "Dataset 1",
      "date": "2019-01-01T00:00:00.000Z",
      "value": 0
    },
    {
      "group": "Dataset 1",
      "date": "2019-01-06T00:00:00.000Z",
      "value": -37312
    },
    {
      "group": "Dataset 1",
      "date": "2019-01-08T00:00:00.000Z",
      "value": -22392
    },
    {
      "group": "Dataset 1",
      "date": "2019-01-15T00:00:00.000Z",
      "value": -52576
    },
    {
      "group": "Dataset 1",
      "date": "2019-01-19T00:00:00.000Z",
      "value": 20135
    },
    {
      "group": "Dataset 2",
      "date": "2019-01-01T00:00:00.000Z",
      "value": 47263
    },
    {
      "group": "Dataset 2",
      "date": "2019-01-05T00:00:00.000Z",
      "value": 14178
    },
    {
      "group": "Dataset 2",
      "date": "2019-01-08T00:00:00.000Z",
      "value": 23094
    },
    {
      "group": "Dataset 2",
      "date": "2019-01-13T00:00:00.000Z",
      "value": 45281
    },
    {
      "group": "Dataset 2",
      "date": "2019-01-19T00:00:00.000Z",
      "value": -63954
    }
  ]

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

  constructor() { }

  ngOnInit(): void {
    console.log(this.sensors);
  }


  log(x:any) { console.log(x) }
}
