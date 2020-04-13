import { Component, OnInit } from '@angular/core';
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

  constructor(private userService:UserService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.route.data.subscribe(data => {
        if(data.no_reload) return;
        this.userService.getUserByUsername(params.username).subscribe(user => {
          this.user = user;
        })  
      })
    })
  }
}
