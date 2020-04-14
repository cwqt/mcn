import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-posts-list',
  templateUrl: './user-posts-list.component.html',
  styleUrls: ['./user-posts-list.component.css']
})
export class UserPostsListComponent implements OnInit {
  isActive:boolean = false;
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "posts") this.isActive = true;
      if(this.isActive) console.log('posts!')
    })
  }

}
