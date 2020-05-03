import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { IDeviceStub } from '../../../../../../../../backend/lib/models/Device.model';

@Component({
  selector: 'app-device-thumb',
  templateUrl: './device-thumb.component.html',
  styleUrls: ['./device-thumb.component.scss']
})
export class DeviceThumbComponent implements OnInit {
  @Input() profileUser:IUser;
  @Input() currentUser:IUser;
  @Input() device:IDeviceStub;

  mostRecentUpdate:any
  state:any;
  iconMap = {
    ["ACTIVE"]:"signal_cellular_4_bar",
    ["INACTIVE"]:"signal_cellular_off",
    ["UNVERIFIED"]:"signal_cellular_connected_no_internet_4_bar"
  }
  meta:undefined;
  latest_data:undefined;

  constructor(private router:Router) {
    this.mostRecentUpdate = {}
    this.state = {
      active: true,
      verified: true,
      text: "",
      icon:""
    }

    this.state.text = this.getStateText();
    this.state.icon = this.iconMap[this.state.text]
  }

  getStateText() {
    if(this.state.verified && this.state.active) return "ACTIVE"
    if(this.state.verified && !this.state.active) return "INACTIVE"
    if(!this.state.verified) return "UNVERIFIED";
  }

  ngOnInit(): void {
  }

  getDeviceMeta() {

  }

  getLatestData() {

  }

  gotoDevice() {
    this.router.navigate([`/${this.currentUser.username}/devices/${this.device._id}`])
  }
}
