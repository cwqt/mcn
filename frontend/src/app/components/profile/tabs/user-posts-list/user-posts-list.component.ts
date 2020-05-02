import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

import { IPost } from '../../../../../../../backend/lib/models/Post.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';

@Component({
  selector: 'app-user-posts-list',
  templateUrl: './user-posts-list.component.html',
  styleUrls: ['./user-posts-list.component.scss']
})
export class UserPostsListComponent implements OnInit {
  @Input() profileUser:IUser;
  @Input() currentUser:IUser;

  isActive:boolean      = false;
  initialised:boolean   = false;

  loading:boolean       = false;
  posts:IPost[]  = [];

  success:boolean;
  
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "posts") this.isActive = true;
      if(this.isActive && !this.initialised) this.initialise();
    })
  }

  initialise() {
    this.loading = true;
    this.initialised = true;
    this.profileService.getPosts().then((posts:IPost[]) => {
      this.posts = posts;
      this.loading = false;
    });
  }

  addPost(post) {
    this.posts.unshift(post);
  }
}
