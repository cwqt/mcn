import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { IDevice } from '../../../../../../backend/lib/models/Device.model';

@Component({
  selector: 'app-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss']
})
export class DeviceControlComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  @Input() device:IDevice;

  constructor() { }

  ngOnInit(): void {
  }

}
