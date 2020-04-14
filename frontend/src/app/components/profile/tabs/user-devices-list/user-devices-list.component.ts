import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-devices-list',
  templateUrl: './user-devices-list.component.html',
  styleUrls: ['./user-devices-list.component.css']
})
export class UserDevicesListComponent implements OnInit {
  isActive:boolean = false;
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "devices") this.isActive = true;
      if(this.isActive) console.log('devices!')
    })
  }

}
