import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { IUser } from "../../../backend/lib/models/User.model";

import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "fe";
  currentUser: IUser;
  ui: string = "register";

  constructor(private userService: UserService, private router: Router) {
    console.log(
      `Running in: ${environment.production ? "production" : "development"}`
    );

    //upon start up, immediately get the new user
    if (this.userService.currentUserValue) {
      this.userService.updateCurrentUser();
    }
  }

  ngOnInit() {
    this.userService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (this.currentUser) {
        console.log("already logged in");
        if (this.currentUser.new_user) {
          console.log("needs to do first time stuff");
        } else {
          this.router.navigate(["/"]);
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
