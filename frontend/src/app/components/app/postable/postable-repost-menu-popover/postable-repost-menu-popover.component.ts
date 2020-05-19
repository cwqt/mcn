import { Component, OnInit } from '@angular/core';
import { Popover } from 'src/assets/popover';

@Component({
  selector: 'app-postable-repost-menu-popover',
  templateUrl: './postable-repost-menu-popover.component.html',
  styleUrls: ['./postable-repost-menu-popover.component.scss']
})
export class PostableRepostMenuPopoverComponent implements OnInit {


  constructor(private popover:Popover) { }

  ngOnInit(): void {
    console.log('==>', this.popover);
  }

  repostPostable() {}

  unrepostRepost() {}

  openRepostDialog() {}
}
