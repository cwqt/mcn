import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserService } from "./user.service";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { IUser, IDeviceStub } from "../imports";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private currentProfileSubject: BehaviorSubject<IUser> = new BehaviorSubject(
    undefined
  );
  public currentProfile: Observable<any>;

  public get currentProfileValue() {
    return this.currentProfileSubject.getValue();
  }

  selectedTab: BehaviorSubject<string> = new BehaviorSubject("plants");
  cachedTabs = [];

  constructor(private userService: UserService, private http: HttpClient) {
    this.currentProfile = this.currentProfileSubject.asObservable();
  }

  getUserByUsername(username: string) {
    return this.http
      .get<IUser>(`/api/users/u/${username}`)
      .pipe(
        map((user) => {
          this.currentProfileSubject.next(user);
          return user;
        })
      )
      .toPromise();
  }

  getDevices(page?: number, per_page?: number) {
    let query = "";
    if (page != undefined && per_page)
      query = `?page=${page}&per_page=${per_page}`;

    return this.http
      .get(`/api/users/${this.currentProfileValue._id}/devices${query}`)
      .pipe(
        //pagination: IPaginator
        map((response: { data: IDeviceStub[] }) => {
          return response;
        })
      )
      .toPromise();
  }
}
