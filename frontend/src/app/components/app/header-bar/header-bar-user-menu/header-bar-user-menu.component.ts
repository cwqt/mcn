import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar-user-menu',
  templateUrl: './header-bar-user-menu.component.html',
  styleUrls: ['./header-bar-user-menu.component.scss']
})
export class HeaderBarUserMenuComponent implements OnInit {

  constructor(private authService:AuthenticationService,
    private router:Router) { }

  ngOnInit(): void {
  }

  logout() { this.authService.logout(); }

  gotoDocumentation() {
    this.router.navigate(['/documentation'])
  }

  gotoSettings() {
    this.router.navigate(['/settings'])
  }

}
