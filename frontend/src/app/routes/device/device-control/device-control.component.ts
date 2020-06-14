import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { IDevice, IDeviceState, IDeviceStub } from '../../../../../../backend/lib/models/Device/Device.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss']
})
export class DeviceControlComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  @Input() device:IDevice;

  // _id: string,
  // ref: string,
  // value: string | number | boolean,
  // name: string,
  // description: string,
  // state:           IoTState,
  // type:            Type,


  displayedColumns: string[] = ['ref', 'name', 'set-value'];
  cache = {
    states: {
      data: undefined,
      loading: true,
      error: ""
    },
  }

  constructor(private deviceService:DeviceService) { }

  ngOnInit(): void {
    this.getDeviceStates(this.authorUser._id, this.device._id)
      .then(() => console.log(this.cache.states));
  }

  getDeviceStates(user_id:string, device_id:string):Promise<IDeviceState[]> {
    this.cache.states.loading = true;
    return this.deviceService.getDeviceStates(user_id, device_id)
      .then((states:IDeviceState[]) => this.cache.states.data = states)
      .catch(e => this.cache.states.error = e)
      .finally(() => this.cache.states.loading = false)
  }

}
