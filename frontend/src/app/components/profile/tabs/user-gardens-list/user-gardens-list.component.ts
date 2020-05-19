import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-gardens-list',
  templateUrl: './user-gardens-list.component.html',
  styleUrls: ['./user-gardens-list.component.css']
})
export class UserGardensListComponent implements OnInit {

  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {

  }
}
