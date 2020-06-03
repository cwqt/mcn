import { Component, OnInit, ViewEncapsulation, NO_ERRORS_SCHEMA } from '@angular/core';
import { IUser } from '../../../../../backend/lib/models/User.model';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

import { IRecordableStub } from '../../../../../backend/lib/models/Recordable.model';
import { IDeviceStub } from '../../../../../backend/lib/models/Device/Device.model';

import { UserPostsListComponent } from '../../components/profile/tabs/user-posts-list/user-posts-list.component';
import { UserPlantsListComponent } from '../../components/profile/tabs/user-plants-list/user-plants-list.component';
import { UserGardensListComponent } from '../../components/profile/tabs/user-gardens-list/user-gardens-list.component';
import { UserDevicesListComponent } from '../../components/profile/tabs/user-devices-list/user-devices-list.component';
import { ProfileService } from 'src/app/services/profile.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  loading:boolean = true;
  tabIndex:number = 0;
  showOutlet:boolean = false;
  outletTitle:string = "Post";
  canLoadTabContents:BehaviorSubject<boolean> = new BehaviorSubject(false);

  authorUser:IUser | undefined;
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
    private profileService:ProfileService) {
      this.showOutlet = false;
    }

  ngOnInit(): void {
    //route param change request different user
    this.route.params.subscribe(params => {
      console.log(params)

      this.profileService.getUserByUsername(params.username)
        .then(user => this.authorUser = user)
        .then(() => this.loading = false)
        .catch(e => {
          console.log(e);
          this.loading = false;
        })
    });

    this.route.queryParams.subscribe(queries => {
      if('tab' in queries) {
        this.tabIndex = this.tabs.findIndex(tab => tab.label == queries.tab);
        this.profileService.selectedTab.next(queries['tab']);
      }
      console.log(this.route)
    });

    this.userService.currentUser.subscribe(user => this.currentUser = user );
  }

  setActiveTab(tab:MatTabChangeEvent) {
    this.canLoadTabContents.next(false);
    this.router.navigateByUrl(`${this.authorUser.username}?tab=${this.tabs[tab.index].label}`)
  }

  setCanLoadTabContent() {
    this.canLoadTabContents.next(true);
  }

  onActivate() {
    setTimeout(() => {
      this.showOutlet = true;
    }, 0)
  }

  onDeactivate() {
    setTimeout(() => {
      this.showOutlet = false;
    }, 0)
  }

  goBackToProfile() {
    this.router.navigate([`/${this.currentUser.username}`])
  }

  pretty(label:string) {
    return (label.charAt(0).toUpperCase() + label.slice(1)).slice(0, -1);;
  }
}
