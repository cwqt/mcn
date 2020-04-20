import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

import { IPostModel } from '../../../../../../../backend/lib/models/Post.model';
import { IUserModel } from '../../../../../../../backend/lib/models/User.model';

@Component({
  selector: 'app-user-posts-list',
  templateUrl: './user-posts-list.component.html',
  styleUrls: ['./user-posts-list.component.scss']
})
export class UserPostsListComponent implements OnInit {
  @Input() user:IUserModel;
  @Input() currentUser:IUserModel;

  isActive:boolean      = false;
  initialised:boolean   = false;
  loading:boolean       = false;
  userIsOurself:boolean = false;
  posts:IPostModel[]  = [];
  
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    if(this.currentUser.username == this.user.username) this.userIsOurself = true;
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "posts") this.isActive = true;
      if(this.isActive && !this.initialised) this.initialise();
    })
  }

  initialise() {
    this.loading = true;
    this.initialised = true;
    this.profileService.getPosts().then((posts:IPostModel[]) => {
      this.posts = posts;
      this.loading = false;
    });
  }
}
