import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

import { AuthenticationService } from './services/authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe';
  currentUser:any;

  constructor( private router: Router, private authService: AuthenticationService) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
      console.log(`Running in: ${environment.production ? 'production' : 'development'}`)
    }

  logout() {
      this.authService.logout();
      this.router.navigate(['/']);
  }
}
