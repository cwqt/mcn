import { Component, OnInit, Input } from '@angular/core';
import { IUser, IUserModel } from '../../../../../../backend/lib/models/User.model';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit {
  @Input() user:IUserModel; //the current profile being viewed
  currentUser:IUserModel; //the current logged in user
  
  constructor(private userService:UserService, private profileService:ProfileService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.currentUser = user);
  }

  navigateRecordable($event) {
    this.profileService.selectedTab.next($event);
  }
}
