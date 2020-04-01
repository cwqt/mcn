import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit {
  @Input() user:any = {}
  
  constructor() { }


  ngOnInit(): void {
  }

}
