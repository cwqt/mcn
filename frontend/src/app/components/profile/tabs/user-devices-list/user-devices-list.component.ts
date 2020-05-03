import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateDeviceGuideComponent } from './create-device-guide/create-device-guide.component';

@Component({
  selector: 'app-user-devices-list',
  templateUrl: './user-devices-list.component.html',
  styleUrls: ['./user-devices-list.component.scss']
})
export class UserDevicesListComponent implements OnInit {
  @Input() profileUser:IUser;
  @Input() currentUser:IUser;

  isActive:boolean      = false;
  initialised:boolean   = false;

  loading:boolean       = false;
  success:boolean;
  devices:IDeviceStub[] = [];
  
  constructor(private profileService:ProfileService, public dialog:MatDialog) {}

  openCreateDeviceDialog():void {
    const dialogRef = this.dialog.open(CreateDeviceGuideComponent, {
      width: '50%',
      data: {}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "devices") this.isActive = true;
      if(this.isActive && !this.initialised) this.initialise();
    })
  }

  initialise() {
    this.loading = true;
    this.initialised = true;
    this.profileService.getDevices().then((devices:IDeviceStub[]) => {
      this.devices = devices;
      this.loading = false;
    });
  }
}
