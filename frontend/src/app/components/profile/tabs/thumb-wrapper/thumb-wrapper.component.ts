import { Component, OnInit, Input } from '@angular/core';
import { IPlant } from '../../../../../../../backend/lib/models/Plant.model';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device.model';
import { IRecordableStub, RecordableType } from '../../../../../../../backend/lib/models/Recordable.model';
import { MatDialog } from '@angular/material/dialog';
import { RepostDialogComponent } from 'src/app/components/app/repost-dialog/repost-dialog.component';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { Router } from '@angular/router';

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
  dialogData:any;

  constructor(
    private dialog:MatDialog,
    private router:Router
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

    this.dialogData = {
      type: this.type,
      object: this.thumbItem,
      user: this.user,
      currentUser: this.currentUser
    }
  }

  openRepostDialog() {
    const dialogRef = this.dialog.open(RepostDialogComponent, {
      width: '50%',
      data: this.dialogData
    })
  }

  gotoItem() {
    this.router.navigate([`${this.user.username}/${this.type}s/${this.thumbItem._id}`])
  }
}
