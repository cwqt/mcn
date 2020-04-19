import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post_id:string;
  post:any;
  user:any;

  constructor(private profileService:ProfileService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.post_id = this.route.snapshot.paramMap.get('pid');
    this.getFullPost();
    this.profileService.currentProfile.subscribe(user => this.user = user)
  }

  getFullPost() {
    this.profileService.getFullPost(this.post_id).then(post => {
      console.log(post)
      this.post = post
    });
  }
}
