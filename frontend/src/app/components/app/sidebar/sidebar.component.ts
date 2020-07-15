import { Component, OnInit, Input, Output } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() currentUser: any;
  sidebarItems = [];
  activePath: string = "";
  sidebarMenuOpen: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sidebarItems = [
      ["compass", "Explore"],
      ["user", "Profile", `${this.currentUser.username}`],
      ["overflow-menu--horizontal", "More", `more`],
    ];

    this.route.url.subscribe((url) => {
      if (url.length == 0) {
        this.activePath = "";
      } else {
        this.activePath = url[url.length - 1].path;
      }
    });
  }

  isActiveRoute(index) {
    if (this.activePath == this.sidebarItems[index][1].toLowerCase()) {
      return true;
    }
  }

  changeRoute(index) {
    this.router.navigateByUrl(this.sidebarItems[index][2]);
  }

  toggleSidebarMenu() {
    this.sidebarMenuOpen = !this.sidebarMenuOpen;
  }
}
