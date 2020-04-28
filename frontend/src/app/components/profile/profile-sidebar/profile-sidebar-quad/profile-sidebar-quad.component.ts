import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-sidebar-quad',
  templateUrl: './profile-sidebar-quad.component.html',
  styleUrls: ['./profile-sidebar-quad.component.scss']
})
export class ProfileSidebarQuadComponent implements OnInit {
  quads = [
    ['visibility', 'Activity'],
    ['timeline', 'Timeline'],
    ['group', 'Groups'],
    ['settings', 'Edit Profile']
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
