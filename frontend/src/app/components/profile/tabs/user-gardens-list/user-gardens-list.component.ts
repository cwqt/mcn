import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-gardens-list',
  templateUrl: './user-gardens-list.component.html',
  styleUrls: ['./user-gardens-list.component.css']
})
export class UserGardensListComponent implements OnInit {
  isActive:boolean = false;
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "gardens") this.isActive = true;
      if(this.isActive) console.log('gardens!')
    })
  }
}
