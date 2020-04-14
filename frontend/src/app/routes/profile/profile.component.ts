import { Component, OnInit, ViewChild, ViewChildren, Injector } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IUserModel } from '../../../../../backend/lib/models/User.model';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

import { IPlantModel } from '../../../../../backend/lib/models/Plant.model';
import { IGardenModel } from '../../../../../backend/lib/models/Garden.model';
import { IDeviceModel } from '../../../../../backend/lib/models/Device.model';

import { UserPostsListComponent } from '../../components/profile/tabs/user-posts-list/user-posts-list.component';
import { UserPlantsListComponent } from '../../components/profile/tabs/user-plants-list/user-plants-list.component';
import { UserGardensListComponent } from '../../components/profile/tabs/user-gardens-list/user-gardens-list.component';
import { UserDevicesListComponent } from '../../components/profile/tabs/user-devices-list/user-devices-list.component';
import { stringify } from 'querystring';
import { ProfileService } from 'src/app/services/profile.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user:IUserModel;

  plants:IPlantModel[] | undefined;
  gardens:IGardenModel[] | undefined;
  devices:IDeviceModel[] | undefined;

  tabs = [
    {label: "posts",    component: UserPostsListComponent},
    {label: "plants",   component: UserPlantsListComponent},
    {label: "gardens",  component: UserGardensListComponent},
    {label: "devices",  component: UserDevicesListComponent}
  ];

  tabIndex:number = 0;

  constructor(private userService:UserService,
    private route:ActivatedRoute,
    private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.tabIndex = this.tabs.findIndex(tab => tab.label == key);
    })

    //route param change request different user
    this.route.params.subscribe(params => this.profileService.getUserByUsername(params.username));
    //subscribe to the new user being gotten
    this.profileService.currentProfileSubject.subscribe(user => this.user = user );
  }

  setActiveTab(tab:MatTabChangeEvent) {
    this.profileService.selectedTab.next(this.tabs[tab.index].label);
  }
}
