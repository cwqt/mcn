import { Component, OnInit } from "@angular/core";
import { IOrgStub } from "@cxss/interfaces";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  userOrgs: IOrgStub[];

  coverCards = [
    { title: "Devices", icon: "mediation" },
    { title: "Alerts", icon: "notifications" },
    { title: "Farms", icon: "account_tree" },
    { title: "Racks", icon: "reorder" },
    { title: "Crops", icon: "view_comfy" },
    { title: "Users", icon: "group" },
  ];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.userOrgs.subscribe((orgs) => (this.userOrgs = orgs));
  }

  navigate(route: string) {
    this.router.navigate([route.toLowerCase()]);
  }

  random() {
    return Math.floor(Math.random() * 100);
  }
}
