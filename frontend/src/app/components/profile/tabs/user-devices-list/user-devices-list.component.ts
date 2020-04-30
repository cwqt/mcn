import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IDeviceModel, IDevice } from '../../../../../../../backend/lib/models/Device.model';
import { IUserModel } from '../../../../../../../backend/lib/models/User.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateDeviceGuideComponent } from './create-device-guide/create-device-guide.component';

@Component({
  selector: 'app-user-devices-list',
  templateUrl: './user-devices-list.component.html',
  styleUrls: ['./user-devices-list.component.scss']
})
export class UserDevicesListComponent implements OnInit {
  @Input() user:IUserModel;
  @Input() currentUser:IUserModel;

  isActive:boolean      = false;
  initialised:boolean   = false;

  loading:boolean       = false;
  userIsOurself:boolean = false;
  devices:IDeviceModel[]  = [];

  success:boolean;
  
  constructor(private profileService:ProfileService, public dialog: MatDialog) {}

  openDialog():void {
    const dialogRef = this.dialog.open(CreateDeviceGuideComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    if(this.currentUser.username == this.user.username) this.userIsOurself = true;
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "devices") this.isActive = true;
      if(this.isActive && !this.initialised) this.initialise();
    })
  }

  initialise() {
    this.loading = true;
    this.initialised = true;
    this.profileService.getDevices().then((devices:IDeviceModel[]) => {
      this.devices = devices;
      this.loading = false;
    });
  }
}
