import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IPostStub, Postable, PostableType } from '../../../../../../../backend/lib/models/Post.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { Popover } from 'src/assets/popover';
import { PostableRepostMenuPopoverComponent, IPostableMenuData } from '../postable-repost-menu-popover/postable-repost-menu-popover.component';
import { RepostDialogComponent } from '../../repost-dialog/repost-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { PostableService } from 'src/app/services/postable.service';

@Component({
  selector: 'app-postable-social-actions',
  templateUrl: './postable-social-actions.component.html',
  styleUrls: ['./postable-social-actions.component.scss']
})
export class PostableSocialActionsComponent implements OnInit {
  @Input() postable:Postable;
  @Input() type:PostableType;
  @Input() authorUser:IUser;
  @Input() currentUser:IUser;
  @Input() showNumbers:boolean = true;
  @Input() justify:boolean = false;

  @ViewChild('repostMenuHitbox') repostMenuHitbox:MatButton;
  dialogData:IPostableMenuData;

  constructor(private popover:Popover,
    private postableService:PostableService,
    private dialog:MatDialog) { }

  ngOnInit(): void {
    this.dialogData = {
      type: this.type,
      postable: this.postable,
      authorUser: this.authorUser,
      currentUser: this.currentUser
    }
  }

  openRepostMenuPopover(event) {
    event.stopPropagation();
    this.popover.load({
      targetElement: this.repostMenuHitbox._elementRef.nativeElement,
      component: PostableRepostMenuPopoverComponent,
      offset: 16,
      data: {
        currentUser: this.currentUser,
        authorUser: this.authorUser,
        postable: this.postable,
        type: this.type
      } as IPostableMenuData
    })
  }

  openRepostDialog(event) {
    event.stopPropagation();
    this.popover.close();
    const dialogRef = this.dialog.open(RepostDialogComponent, {
      width: '50%',
      data: this.dialogData
    })
  }

  repostPostable(event) {
    event.stopPropagation();
    this.popover.close();
    if(this.postable.meta.hasReposted) {
      this.postable.meta.hasReposted = false;
      this.postable.meta.reposts--;
      this.postableService.deleteRepost(this.type, this.authorUser._id, this.postable._id);
    } else {
      this.postable.meta.hasReposted = true;
      this.postable.meta.reposts++;
      this.postableService.repostItem(this.type, this.authorUser._id, this.postable._id);
    }
  }

  toggleHeartingState(event) {
    event.stopPropagation();
    if(this.postable.meta.isHearting) {
      this.postable.meta.hearts--;
      this.postable.meta.isHearting = false;
      this.postableService.unheartItem(this.type, this.authorUser._id, this.postable._id)
    } else {
      this.postable.meta.hearts++;
      this.postable.meta.isHearting = true;
      this.postableService.heartItem(this.type, this.authorUser._id, this.postable._id)
    }
  }
}
