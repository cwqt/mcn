import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device/Device.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateDeviceGuideComponent } from './create-device-guide/create-device-guide.component';
import { BehaviorSubject } from 'rxjs';
import { IPaginator } from '../../../../../../../backend/lib/models/Recordable.model';

@Component({
  selector: 'app-user-devices-list',
  templateUrl: './user-devices-list.component.html',
  styleUrls: ['./user-devices-list.component.scss']
})
export class UserDevicesListComponent implements OnInit {
  @Input() authorUser:IUser;
  @Input() currentUser:IUser;
  @Input() canLoad:BehaviorSubject<boolean>;
  @Input() currentIndex:number;
  @Input() selfIndex:number;

  initialised:boolean = false;
  loading:boolean = false;
  error:string;
  devices:IDeviceStub[] = [];
  pagination:IPaginator;
  
  constructor(private profileService:ProfileService, public dialog:MatDialog) {}

  ngOnInit(): void {
    this.loading = true;
    this.canLoad.subscribe((canLoad:boolean) => {
      if(canLoad && this.currentIndex == this.selfIndex) {
        if(!this.initialised) this.initialise();
      }
    })
  }

  initialise() {
    this.initialised = true;
    this.getDevices(0, 1);
  }

  getDevices(page:number, per_page:number) {
    this.profileService.getDevices(page, per_page)
      .then((response:{data:IDeviceStub[], pagination:IPaginator}) => {
        this.devices = response.data;
        this.pagination = response.pagination;
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false);
  }

  openCreateDeviceDialog():void {
    const dialogRef = this.dialog.open(CreateDeviceGuideComponent, {
      width: '50%',
      data: {}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
