import { Injectable } from "@angular/core";
import { IOrgStub, IOrg } from "../models";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class OrganisationService {
  currentOrg: BehaviorSubject<IOrg | null> = new BehaviorSubject(null);

  constructor(private userService: UserService, private http: HttpClient) {}

  createOrganisation(data): Promise<IOrgStub> {
    return this.http
      .post<IOrgStub>("/api/orgs", data)
      .pipe(
        tap((d) =>
          this.userService.userOrgs.next([
            d,
            ...this.userService.userOrgs.value,
          ])
        )
      )
      .toPromise();
  }

  setActiveOrg(org: IOrgStub) {
    if (org) {
      localStorage.setItem("lastActiveOrg", org._id);
      this.currentOrg.next(org);
    }
  }
}
