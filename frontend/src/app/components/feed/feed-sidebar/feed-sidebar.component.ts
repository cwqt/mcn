import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feed-sidebar',
  templateUrl: './feed-sidebar.component.html',
  styleUrls: ['./feed-sidebar.component.scss']
})
export class FeedSidebarComponent implements OnInit {
  @Input() currentUser:any;

  feedSidebar = [
    ["home", "Home"],
    ["explore", "Explore"],
    ["notifications", "Notifications"],
    ["group_work", "Gardens"],
    ["eco", "Plants"],
    ["device_hub", "Devices"],
    ["more_horiz", "More"],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
