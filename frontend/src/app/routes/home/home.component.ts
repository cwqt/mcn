import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser:any = {};

  constructor(private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.currentUser = user)
  }



}
