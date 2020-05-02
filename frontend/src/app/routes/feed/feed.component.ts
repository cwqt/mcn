import { Component, OnInit } from '@angular/core';

import { IUser } from "../../../../../backend/lib/models/User.model";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  currentUser:IUser;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.currentUser = user)
  }
}
