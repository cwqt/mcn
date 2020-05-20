import { Component, OnInit } from '@angular/core';
import { Popover } from 'src/assets/popover';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { PostableType, Postable } from '../../../../../../../backend/lib/models/Post.model';

export interface IPostableMenuData {
  currentUser:IUser,
  authorUser:IUser,
  postable:Postable,
  type:PostableType
}

@Component({
  selector: 'app-postable-repost-menu-popover',
  templateUrl: './postable-repost-menu-popover.component.html',
  styleUrls: ['./postable-repost-menu-popover.component.scss']
})
export class PostableRepostMenuPopoverComponent implements OnInit {
  data:IPostableMenuData;

  constructor(private popover:Popover) { }

  ngOnInit(): void {
    this.data = this.popover.overlay.componentRefs[0].instance.properties.metadata.data
  }

  repostPostable() {
    this.popover.close();
    switch(this.data.type) {
      case 'post':
        break;
    }
  }

  unrepostRepost() {
    this.popover.close();
  }

  openRepostDialog() {
    this.popover.close();

  }
}
