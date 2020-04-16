import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IPlantModel } from '../../../../backend/lib/models/Plant.model';
import { IUserModel } from '../../../../backend/lib/models/User.model';
import { IPostModel } from '../../../../backend/lib/models/Post.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentProfileSubject:BehaviorSubject<IUserModel> = new BehaviorSubject(undefined);
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
    return this.http.get<IUserModel>(`/api/users/u/${username}`)
      .pipe(map(user => {
        this.currentProfileSubject.next(user);
        return user;
      })).toPromise();
  }

  getPosts() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/posts`)
      .pipe(map((posts:IPostModel[]) => {
        return posts;
      })).toPromise();
  }

  getPlants() {
    return this.http.get(`/api/users/${this.currentProfileValue._id}/plants`)
      .pipe(map((plants:IPlantModel[]) => {
        return plants;
      })).toPromise();
  }
}
