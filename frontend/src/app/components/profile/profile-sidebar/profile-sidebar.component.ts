import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit {
  @Input() profileUser:IUser; //the current profile being viewed
  @Input() currentUser:IUser; //current logged in user
  notFound:boolean = false;
  
  constructor(private route:ActivatedRoute, private profileService:ProfileService) {
  }

  ngOnInit(): void {
    console.log('-->', this.profileUser)
    if(this.profileUser == undefined) {
      this.notFound = true;
      this.profileUser = {
        username: this.route.snapshot.params.username
      } as IUser
    }
  }

  navigateRecordable($event) {
    this.profileService.selectedTab.next($event);
  }
}
