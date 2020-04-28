import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { IUserModel } from '../../../../../backend/lib/models/User.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentUser:IUserModel;
  constructor(private router:Router, private userService:UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(x => {
      this.currentUser = x;
      if(this.currentUser) {
        console.log('already logged in')
        if(this.currentUser.new_user) {
          console.log('needs to do first time stuff')
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }
}
