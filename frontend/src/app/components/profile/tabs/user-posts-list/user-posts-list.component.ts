import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

import { IPost } from '../../../../../../../backend/lib/models/Post.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-posts-list',
  templateUrl: './user-posts-list.component.html',
  styleUrls: ['./user-posts-list.component.scss']
})
export class UserPostsListComponent implements OnInit {
  @Input() profileUser:IUser;
  @Input() currentUser:IUser;
  @Input() canLoad:BehaviorSubject<boolean>;
  @Input() currentIndex:number;
  @Input() selfIndex:number;

  initialised:boolean = false;
  loading:boolean = false;
  error:string = "";
  posts:IPost[] = [];

  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.loading = true;
    this.canLoad.subscribe((canLoad:boolean) => {
      if(canLoad && this.currentIndex == this.selfIndex) {
        if(!this.initialised) this.initialise();
      }
    })
  }

  initialise() {
    this.initialised = true;
    this.profileService.getPosts()
      .then((posts:IPost[]) => {
        this.posts = posts;
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false);
  }

  addPost(post:IPost) {
    this.posts.unshift(post);
  }
}
