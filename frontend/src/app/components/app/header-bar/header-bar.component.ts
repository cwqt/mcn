import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Popover, PopoverProperties } from "../../../../assets/popover";
import { HeaderBarUserMenuComponent } from "./header-bar-user-menu/header-bar-user-menu.component";
import { OrganisationService } from "src/app/services/organisation.service";
import { UserService } from "src/app/services/user.service";

import { IOrgStub } from "src/app/models";

@Component({
  selector: "app-header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.scss"],
})
export class HeaderBarComponent implements OnInit {
  @Input() currentUser: any;
  userOrgs: IOrgStub[];
  activeOrg: IOrgStub;

  constructor(
    private popover: Popover,
    private orgService: OrganisationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.userOrgs.subscribe((orgs) => {
      this.userOrgs = orgs;
    });
    this.orgService.currentOrg.subscribe((org) => (this.activeOrg = org));
  }

  openUserMenu(event) {
    this.popover.load({
      event,
      component: HeaderBarUserMenuComponent,
      offset: 16,
      width: "500px",
      placement: "bottom-left",
    } as PopoverProperties);
  }

  hideUserMenu() {
    this.popover.close();
  }

  setActiveOrg(org: IOrgStub) {
    this.orgService.setActiveOrg(org);
  }
}
