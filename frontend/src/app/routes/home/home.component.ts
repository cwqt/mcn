import { Component, OnInit } from '@angular/core';

import { IUserModel, User } from "../../../../../backend/lib/models/User.model";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser:IUserModel;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.currentUser = user)
  }
}
