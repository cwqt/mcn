import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device/Device.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateDeviceGuideComponent } from './create-device-guide/create-device-guide.component';
import { BehaviorSubject } from 'rxjs';
import { IPaginator } from '../../../../../../../backend/lib/models/Recordable.model';
import { PageEvent, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pagination:IPaginator = {
    next: null,
    prev: null,
    first: null,
    last: null,
    total_results: 0
  };
  
  constructor(private profileService:ProfileService, public dialog:MatDialog) {}

  ngOnInit(): void {
    this.canLoad.subscribe((canLoad:boolean) => {
      if(canLoad && this.currentIndex == this.selfIndex) {
        if(!this.initialised) this.initialise();
      }
    })
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((pageEvent:PageEvent) => {
      this.getDevices(pageEvent.pageIndex, pageEvent.pageSize)
    })
  }

  initialise() {
    this.initialised = true;
    this.getDevices(1, 1);
  }

  getDevices(page:number, per_page:number) {
    this.loading = true;

    setTimeout(() => {
      this.profileService.getDevices(page, per_page)
      .then((response:{data:IDeviceStub[], pagination:IPaginator}) => {
        this.devices = response.data;
        this.pagination = response.pagination;
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false);

    }, 500)

  }

  openCreateDeviceDialog():void {
    const dialogRef = this.dialog.open(CreateDeviceGuideComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
