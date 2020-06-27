import { Injectable } from "@angular/core";
import { IOrg, IOrgStub } from "../../../../backend/lib/models/Orgs.model";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class OrganisationService {
  currentOrg: BehaviorSubject<IOrg | null> = new BehaviorSubject(<IOrg>{
    name: "None",
  });

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
    this.currentOrg.next(org);
  }
}
