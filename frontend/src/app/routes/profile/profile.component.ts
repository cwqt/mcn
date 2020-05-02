import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IUser } from '../../../../../backend/lib/models/User.model';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

import { IRecordableStub } from '../../../../../backend/lib/models/Recordable.model';
import { IDeviceStub } from '../../../../../backend/lib/models/Device.model';

import { UserPostsListComponent } from '../../components/profile/tabs/user-posts-list/user-posts-list.component';
import { UserPlantsListComponent } from '../../components/profile/tabs/user-plants-list/user-plants-list.component';
import { UserGardensListComponent } from '../../components/profile/tabs/user-gardens-list/user-gardens-list.component';
import { UserDevicesListComponent } from '../../components/profile/tabs/user-devices-list/user-devices-list.component';
import { ProfileService } from 'src/app/services/profile.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ProfileComponent implements OnInit {
  loading:boolean = true;
  tabIndex:number;
  showOutlet: boolean;

  profileUser:IUser | undefined;
  currentUser:IUser; //the current logged in user

  plants:IRecordableStub[] | undefined;
  gardens:IRecordableStub[] | undefined;
  devices:IDeviceStub[] | undefined;

  tabs = [
    {label: "posts",    component: UserPostsListComponent},
    {label: "plants",   component: UserPlantsListComponent},
    {label: "gardens",  component: UserGardensListComponent},
    {label: "devices",  component: UserDevicesListComponent}
  ];

  constructor(private userService:UserService,
    private router:Router,
    private route:ActivatedRoute,
    private profileService:ProfileService) { }

  ngOnInit(): void {
    //route param change request different user
    this.route.params.subscribe(params => {
      this.profileService.getUserByUsername(params.username)
        .then(user => this.profileUser = user)
        .then(() => this.loading = false)
        .catch(e => {
          console.log(e);
          this.loading = false;
        })
      });

    this.userService.currentUser.subscribe(user => this.currentUser = user );

    this.profileService.selectedTab.subscribe(key => {
      this.tabIndex = this.tabs.findIndex(tab => tab.label == key);
    })
  }

  setActiveTab(tab:MatTabChangeEvent) {
    this.profileService.selectedTab.next(this.tabs[tab.index].label);
  }

  onActivate(event:any) {
    this.showOutlet = true;
  }

  onDeactivate(event:any) {
    this.showOutlet = false;
  }

  goBackToProfile() {
    this.router.navigate([`/${this.currentUser.username}`])
  }

  pretty(label:string) {
    return (label.charAt(0).toUpperCase() + label.slice(1)).slice(0, -1);;
  }
}
