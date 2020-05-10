import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Input() currentUser:any;
  userMenuOpen:boolean = true;

  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
    console.log(this.currentUser)
  }

  openUserMenu() { this.userMenuOpen = true }
  hideUserMenu() { this.userMenuOpen = false }
  
  logout() { this.authService.logout(); }

  gotoDocumentation() {
    this.router.navigate(['/docs'])
  }

  gotoSettings() {
    this.router.navigate(['/settings'])
  }
}
