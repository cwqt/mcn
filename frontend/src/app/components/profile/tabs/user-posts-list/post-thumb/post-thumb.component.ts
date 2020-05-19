import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Popover, PopoverProperties } from 'src/assets/popover';
import { MatButton } from '@angular/material/button';
import { PostableRepostMenuPopoverComponent } from 'src/app/components/app/postable/postable-repost-menu-popover/postable-repost-menu-popover.component';

@Component({
  selector: 'app-post-thumb',
  templateUrl: './post-thumb.component.html',
  styleUrls: ['./post-thumb.component.scss']
})
export class PostThumbComponent implements OnInit {
  @Input() post:any;
  @Input() author:IUser;
  @Input() currentUser:IUser;
  @Input() mini:boolean = false;

  //reposts ["repost", "repost-comment"]
  @Input() parentAuthor:any;
  @Input() repostType:string;

  @ViewChild('repostMenuHitbox') repostMenuHitbox:MatButton;

  constructor(private router:Router, private postService:PostService, private popover:Popover) { }

  ngOnInit(): void {
  }

  openPostOptionsPopover(event) {
    event.stopPropagation();
  }

  openRepostMenuPopover(event) {
    this.popover.load({
      refComponent: this.repostMenuHitbox._elementRef,
      component: PostableRepostMenuPopoverComponent,
      offset: 16,
      relativeTo: 'profile-body-container',
      data: {
        currentUser: this.currentUser,
        creatorUser: this.author,
        content: this.post,
        type: 'post'
      }
    } as PopoverProperties)
    event.stopPropagation();
  }

  replyToPost(event) {
    event.stopPropagation();

  }

  heartPost(event) {
    event.stopPropagation();
  }

  gotoPost() {
    this.router.navigate([`/${this.currentUser.username}/posts/${this.post._id}`])
  }
}
