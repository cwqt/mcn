import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  currentUser:any;

  constructor(private userService:UserService) {
    this.userService.currentUser.subscribe(user => this.currentUser = user );
  }

  ngOnInit(): void {
  }

}
