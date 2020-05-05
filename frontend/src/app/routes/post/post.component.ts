import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post_id:string;
  post:any;
  user:any;

  constructor(private profileService:ProfileService,
    private postService:PostService,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.post_id = this.route.snapshot.paramMap.get('pid');
    this.getFullPost();
    this.profileService.currentProfile.subscribe(user => this.user = user)
  }

  getFullPost() {
    this.postService.getFullPost(this.post_id).then(post => {
      this.post = post
    });
  }
}
