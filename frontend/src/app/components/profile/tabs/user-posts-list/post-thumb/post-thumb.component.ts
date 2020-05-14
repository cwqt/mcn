import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-thumb',
  templateUrl: './post-thumb.component.html',
  styleUrls: ['./post-thumb.component.scss']
})
export class PostThumbComponent implements OnInit {
  @Input() post:any;
  @Input() author:IUser;
  @Input() currentUser:IUser;

  //reposts ["repost", "repost-comment"]
  @Input() parentAuthor:any;
  @Input() repostType:string;

  isHearting:boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.isHearting = this.post.isHearting ?? false;
  }

  heart() {
    this.isHearting = !this.isHearting;
  }

  gotoPost() {
    this.router.navigate([`/${this.currentUser.username}/posts/${this.post._id}`])
  }
}
