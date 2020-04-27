import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() currentUser:any;

  feedSidebar = [
    ["home", "Home"],
    // ["explore", "Explore"],
    // ["notifications", "Notifications"],
    ["group_work", "Gardens"],
    ["eco", "Plants"],
    ["device_hub", "Devices"],
    ["more_horiz", "More"],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
