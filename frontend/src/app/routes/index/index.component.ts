import { Component, OnInit } from "@angular/core";
import { IOrgStub } from "../../../../../backend/lib/models/Orgs.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  userOrgs: IOrgStub[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userOrgs.subscribe((orgs) => (this.userOrgs = orgs));
  }
}
