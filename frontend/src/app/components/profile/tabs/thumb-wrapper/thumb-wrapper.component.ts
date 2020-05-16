import { Component, OnInit, Input } from '@angular/core';
import { IPlant } from '../../../../../../../backend/lib/models/Plant.model';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device.model';
import { IRecordableStub, RecordableType } from '../../../../../../../backend/lib/models/Recordable.model';
import { MatDialog } from '@angular/material/dialog';
import { RepostDialogComponent } from 'src/app/components/app/repost-dialog/repost-dialog.component';
import { IUser } from '../../../../../../../backend/lib/models/User.model';

@Component({
  selector: 'app-thumb-wrapper',
  templateUrl: './thumb-wrapper.component.html',
  styleUrls: ['./thumb-wrapper.component.scss']
})
export class ThumbWrapperComponent implements OnInit {
  @Input() thumbItem:IRecordableStub | IDeviceStub;
  @Input() type:RecordableType;
  @Input() currentUser:IUser;
  
  thumbPlaceholderIcon:string;

  constructor(
    private dialog:MatDialog
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

  openRepostDialog() {
    const dialogRef = this.dialog.open(RepostDialogComponent, {
      width: '50%',
      data: {
        type: this.type,
        object: this.thumbItem,
        user: this.currentUser
      }
    })
  }
}
