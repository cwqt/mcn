import { Component, OnInit, Input } from '@angular/core';
import { IUserModel } from '../../../../../../../../backend/lib/models/User.model';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-thumb',
  templateUrl: './post-thumb.component.html',
  styleUrls: ['./post-thumb.component.scss']
})
export class PostThumbComponent implements OnInit {
  @Input() post:any;
  @Input() user:IUserModel;
  @Input() currentUser:IUserModel;

  isHearting:boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  heart() {
    this.isHearting = !this.isHearting;
  }

  gotoPost() {
    this.router.navigate([`/u/${this.currentUser.username}/posts/${this.post._id}`])
  }
}
