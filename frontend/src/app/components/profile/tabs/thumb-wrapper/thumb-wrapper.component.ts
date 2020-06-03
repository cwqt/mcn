import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IRecordableStub, RecordableType, IRecordable } from '../../../../../../../backend/lib/models/Recordable.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { Router } from '@angular/router';
import { RecordableService } from 'src/app/services/recordable.service';
import { Popover, PopoverProperties } from 'src/assets/popover';
import { Postable } from '../../../../../../../backend/lib/models/Post.model';
import { IDeviceStub } from '../../../../../../../backend/lib/models/Device/Device.model';

@Component({
  selector: 'app-thumb-wrapper',
  templateUrl: './thumb-wrapper.component.html',
  styleUrls: ['./thumb-wrapper.component.scss']
})
export class ThumbWrapperComponent implements OnInit {
  @Input() recordable:IRecordableStub | IDeviceStub;
  @Input() type:RecordableType;
  @Input() mini:boolean = false;
  
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  
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
    this.router.navigate([`${this.authorUser.username}/${this.type}s/${this.recordable._id}`])
  }
}
