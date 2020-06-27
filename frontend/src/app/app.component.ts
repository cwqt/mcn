import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { IUser } from "../../../backend/lib/models/User.model";

import { UserService } from "./services/user.service";
import { OrganisationService } from "./services/organisation.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "fe";
  currentUser: IUser;
  ui: string = "login";

  constructor(
    private userService: UserService,
    private orgService: OrganisationService,
    private router: Router
  ) {
    console.log(
      `Running in: ${environment.production ? "production" : "development"}`
    );

    (async () => {
      //upon start up, immediately get the new user & set last active org
      if (this.userService.currentUserValue) {
        await this.userService.updateCurrentUser();
        let orgs = await this.userService.getUserOrgs();
        let lastActiveOrgId = localStorage.getItem("lastActiveOrg");
        if (lastActiveOrgId) {
          this.orgService.setActiveOrg(
            orgs.find((o) => o._id == lastActiveOrgId)
          );
        }
      }
    })();
  }

  ngOnInit() {
    this.userService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (this.currentUser) {
        console.log("already logged in");
        if (this.currentUser.new_user) {
          console.log("needs to do first time stuff");
        } else {
          // this.router.navigate(["/"]);
        }
      }
    });
  }

  toggleUiStateRegister() {
    if (this.ui == "login") {
      this.ui = "register";
    } else if (this.ui == "register") {
      this.ui = "login";
    }
  }
}
