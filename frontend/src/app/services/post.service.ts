import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}

  getFullPost(post_id:string) {
    return this.http.get(`/api/users/${this.profileService.currentProfileValue._id}/posts/${post_id}`).toPromise();
  }
}
