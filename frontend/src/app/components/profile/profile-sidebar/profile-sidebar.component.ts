import { Component, OnInit, Input } from '@angular/core';
import { IUser, IUserModel } from '../../../../../../backend/lib/models/User.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit {
  @Input() user:any = {}
  currentUser:IUserModel;
  
  constructor(private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  navigateRecordable($event) {
    console.log($event);
  }
}
