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
import { PostableRepostMenuPopoverComponent } from 'src/app/components/app/postable/postable-repost-menu-popover/postable-repost-menu-popover.component';
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

  @ViewChild('repostMenuHitbox') repostMenuHitbox:MatButton;
  
  thumbPlaceholderIcon:string;
  dialogData:any;

  repostMenuOpen:boolean = false;

  constructor(
    private dialog:MatDialog,
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

    this.dialogData = {
      type: this.type,
      object: this.thumbItem,
      user: this.user,
      currentUser: this.currentUser
    }
  }

  repost() {
    this.popover.close();
    if(this.thumbItem.meta.hasReposted) {
      this.thumbItem.meta.hasReposted = false;
      this.thumbItem.meta.reposts--;
      this.recordableService.deleteRepost(this.type, this.user._id, this.thumbItem._id);
    } else {
      this.thumbItem.meta.hasReposted = true;
      this.thumbItem.meta.reposts++;
      this.recordableService.repostItem(this.type, this.user._id, this.thumbItem._id);
    }
  }

  openRepostMenuPopover(event) {
    this.popover.load({
      targetElement: this.repostMenuHitbox._elementRef.nativeElement,
      component: PostableRepostMenuPopoverComponent,
      offset: 16,
      relativeTo: 'profile-body-container'
    } as PopoverProperties)
    event.stopPropagation();
  }


  openRepostDialog() {
    this.popover.close();
    const dialogRef = this.dialog.open(RepostDialogComponent, {
      width: '50%',
      data: this.dialogData
    })
  }

  gotoItem() {
    this.router.navigate([`${this.user.username}/${this.type}s/${this.thumbItem._id}`])
  }

  toggleHeartingState(event) {
    if(this.thumbItem.meta.isHearting) {
      this.thumbItem.meta.hearts--;
      this.thumbItem.meta.isHearting = false;
      this.recordableService.unheartItem(this.type, this.user._id, this.thumbItem._id)
    } else {
      this.thumbItem.meta.hearts++;
      this.thumbItem.meta.isHearting = true;
      this.recordableService.heartItem(this.type, this.user._id, this.thumbItem._id)
    }
  }
}
