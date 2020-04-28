import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IPlantModel } from '../../../../backend/lib/models/Plant.model';
import { IUserModel } from '../../../../backend/lib/models/User.model';
import { IPostModel } from '../../../../backend/lib/models/Post.model';
import { IDeviceModel } from '../../../../backend/lib/models/Device.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentProfileSubject:BehaviorSubject<IUserModel> = new BehaviorSubject(undefined);
  public currentProfile:Observable<any>;

  public get currentProfileValue() {
    return this.currentProfileSubject.getValue();
  }

  selectedTab:BehaviorSubject<string> = new BehaviorSubject("devices");
  cachedTabs = [];

  constructor(private userService:UserService, private http:HttpClient) {
    this.currentProfile = this.currentProfileSubject.asObservable();
  }

  getUserByUsername(username:string) {
    return this.http.get<IUserModel>(`/api/users/u/${username}`)
      .pipe(map(user => {
        this.currentProfileSubject.next(user);
        return user;
      })).toPromise();
  }

  getPosts() {
    console.log(this.currentProfileValue);
    return this.http.get(`/api/users/${this.currentProfileValue._id}/posts`)
      .pipe(map((posts:IPostModel[]) => {
        return posts;
      })).toPromise();
  }

  getFullPost(post_id:string) {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/posts/${post_id}`).toPromise();
  }

  getPlants() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/plants`)
      .pipe(map((plants:IPlantModel[]) => {
        return plants;
      })).toPromise();
  }

  getDevices() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/devices`)
      .pipe(map((devices:IDeviceModel[]) => {
        return devices;
      })).toPromise();
  }
}
