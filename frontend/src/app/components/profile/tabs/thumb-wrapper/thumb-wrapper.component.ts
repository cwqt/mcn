import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IPlant } from '../../../../../../../backend/lib/models/Plant.model';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device.model';
import { IRecordableStub, RecordableType } from '../../../../../../../backend/lib/models/Recordable.model';
import { MatDialog } from '@angular/material/dialog';
import { RepostDialogComponent } from 'src/app/components/app/repost-dialog/repost-dialog.component';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { Router } from '@angular/router';
import { RecordableService } from 'src/app/services/recordable.service';
import { Popover, PopoverProperties } from 'src/assets/popover';
import { PostableRepostMenuPopoverComponent, IPostableMenuData } from 'src/app/components/app/postable/postable-repost-menu-popover/postable-repost-menu-popover.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-thumb-wrapper',
  templateUrl: './thumb-wrapper.component.html',
  styleUrls: ['./thumb-wrapper.component.scss']
})
export class ThumbWrapperComponent implements OnInit {
  @Input() thumbItem:IRecordableStub | IDeviceStub;
  @Input() type:RecordableType;
  @Input() mini:boolean = false;
  
  @Input() currentUser:IUser;
  @Input() user:IUser;
  
  thumbPlaceholderIcon:string;

  repostMenuOpen:boolean = false;

  constructor(
    private router:Router,
    private recordableService:RecordableService,
    private popover:Popover
  ) {}

  ngOnInit(): void {
    switch(this.type){
      case RecordableType.Plant:
        this.thumbPlaceholderIcon = 'eco';
        break;
      case RecordableType.Garden:
        this.thumbPlaceholderIcon = 'group_work';
        break;
      case RecordableType.Device:
        this.thumbPlaceholderIcon = 'device_hub';
        break;
      default:
        this.thumbPlaceholderIcon = 'help'
        break;
    }
  }

  gotoItem() {
    this.router.navigate([`${this.user.username}/${this.type}s/${this.thumbItem._id}`])
  }
}
