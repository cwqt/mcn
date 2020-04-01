import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { AuthenticationService } from './services/authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe';

  constructor(private router: Router, private authService: AuthenticationService) {
      console.log(`Running in: ${environment.production ? 'production' : 'development'}`)
      if(this.authService.currentUserValue) {
        this.authService.updateCurrentUser()
      }
    }

  logout() {
      this.authService.logout();
      this.router.navigate(['/']);
  }
}
