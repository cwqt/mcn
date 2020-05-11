import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() currentUser:any;
  sidebarOpen:boolean = false;
  feedSidebar = [];
  activePath:string = '';

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.feedSidebar = [
      ["home",       "Home", ''],
      // ["explore", "Explore"],
      // ["notifications", "Notifications"],
      ["group_work", "Gardens", `${this.currentUser.username}?tab=gardens`],
      ["eco",        "Plants",  `${this.currentUser.username}?tab=plants`],
      ["device_hub", "Devices", `${this.currentUser.username}?tab=devices`],
      ["person",     "Profile", `${this.currentUser.username}`],
      ["more_horiz", "More", `more`],
    ];  

    this.route.url.subscribe(url => {
      if(url.length == 0) {
        this.activePath = '';
      } else {
        this.activePath = url[url.length - 1].path
      }
    });
  }

  isActiveRoute(index) {
    if(this.activePath == this.feedSidebar[index][2].split('/').pop()) {
      return true;
    }
  }

  changeRoute(index) {
    this.router.navigateByUrl(this.feedSidebar[index][2])
  }

  openSidebar() { this.sidebarOpen = true }
  hideSidebar() { this.sidebarOpen = false }
  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen }
}
