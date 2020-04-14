import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { AuthenticationService } from './services/authentication.service'
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe';

  constructor(private userService:UserService) {
      console.log(`Running in: ${environment.production ? 'production' : 'development'}`)

      //upon start up, immediately get the new user
      if(this.userService.currentUserValue) {
        this.userService.updateCurrentUser()
      }
    }
}
