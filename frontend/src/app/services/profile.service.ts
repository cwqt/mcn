import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IUser } from '../../../../backend/lib/models/User.model';
import { IPostStub } from '../../../../backend/lib/models/Post.model';
import { IDeviceStub } from '../../../../backend/lib/models/Device.model';
import { IRecordableStub } from '../../../../backend/lib/models/Recordable.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentProfileSubject:BehaviorSubject<IUser> = new BehaviorSubject(undefined);
  public currentProfile:Observable<any>;

  public get currentProfileValue() {
    return this.currentProfileSubject.getValue();
  }

  selectedTab:BehaviorSubject<string> = new BehaviorSubject("plants");
  cachedTabs = [];

  constructor(private userService:UserService, private http:HttpClient) {
    this.currentProfile = this.currentProfileSubject.asObservable();
  }

  getUserByUsername(username:string) {
    return this.http.get<IUser>(`/api/users/u/${username}`)
      .pipe(map(user => {
        this.currentProfileSubject.next(user);
        return user;
      })).toPromise();
  }

  getPosts() {
    console.log(this.currentProfileValue);
    return this.http.get(`/api/users/${this.currentProfileValue._id}/posts`)
      .pipe(map((posts:IPostStub[]) => {
        return posts;
      })).toPromise();
  }

  getPlants() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/plants`)
      .pipe(map((plants:IRecordableStub[]) => {
        return plants;
      })).toPromise();
  }

  getGardens() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/gardens`)
      .pipe(map((gardens:IRecordableStub[]) => {
        return gardens;
      })).toPromise();
  }

  getDevices() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/devices`)
      .pipe(map((devices:IDeviceStub[]) => {
        return devices;
      })).toPromise();
  }
}
