import { Injectable } from "@angular/core";
import {
  IOrgStub,
  IOrg,
  IDeviceStub,
  Paginated,
  IFarmStub,
  IOrgEnv,
} from "@cxss/interfaces";
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

  get orgId() {
    return this.currentOrg.value._id;
  }

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

  getOrg(orgId: string): Promise<IOrgStub> {
    return this.http.get<IOrgStub>(`/api/orgs/${orgId}`).toPromise();
  }

  setActiveOrg(org: IOrgStub) {
    console.log("setting active org");
    localStorage.setItem("lastActiveOrg", org._id);
    this.currentOrg.next(org);
  }

  getDevices(): Promise<Paginated<IDeviceStub>> {
    return this.http
      .get<Paginated<IDeviceStub>>(`/api/orgs/${this.orgId}/devices`)
      .toPromise();
  }

  getFarms(): Promise<Paginated<IFarmStub>> {
    return this.http
      .get<Paginated<IFarmStub>>(`/api/orgs/${this.orgId}/farms`)
      .toPromise();
  }

  getEnvironment(_id: string): Promise<IOrgEnv> {
    return this.http.get<IOrgEnv>(`/api/orgs/${_id}/environment`).toPromise();
  }
}
