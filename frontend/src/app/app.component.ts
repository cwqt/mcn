import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { IUser } from "@cxss/interfaces";

import { UserService } from "./services/user.service";
import { OrganisationService } from "./services/organisation.service";
import { LoginComponent } from "./components/landing/login/login.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { AuthenticationService } from "./services/authentication.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  currentUser: IUser;
  ui: string = "login";
  loading: boolean = true;

  entered = false;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private orgService: OrganisationService,
    private titleService: Title,
    private router: Router,
    private authService: AuthenticationService
  ) {
    console.log(
      `Running in: ${environment.production ? "production" : "development"}`
    );

    // this.entered.next(
    //   localStorage.getItem("entered") === "true" ? true : false
    // );
  }

  async ngOnInit() {
    //upon start up, immediately get the new user & set last active org
    if (this.userService.currentUserValue) {
      await this.userService.updateCurrentUser();
      // this.setEntered(true);
      let orgs = await this.userService.getUserOrgs();
      let lastActiveOrgId = localStorage.getItem("lastActiveOrg");
      if (lastActiveOrgId && orgs?.length) {
        this.orgService.setActiveOrg(
          orgs.find((o) => o._id == lastActiveOrgId)
        );
      }
    }

    this.userService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.loading = false;
      if (this.currentUser) {
        console.log("already logged in");
        if (this.currentUser.new_user) {
          console.log("needs to do first time stuff");
        } else {
          // this.router.navigate(["/"]);
        }
      }
    });

    this.titleService.setTitle("mcn — Index");
  }

  toggleUiStateRegister() {
    if (this.ui == "login") {
      this.ui = "register";
    } else if (this.ui == "register") {
      this.ui = "login";
    }
  }

  openDialog(component: "login" | "register") {
    let dialogRef: MatDialogRef<any>;

    switch (component) {
      case "login":
        dialogRef = this.dialog.open(LoginComponent, {
          width: "700px",
          height: "400px",
        });
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setEntered(state: boolean) {
    // this.entered.next(state);
    // localStorage.setItem("entered", state.toString());
  }
}
