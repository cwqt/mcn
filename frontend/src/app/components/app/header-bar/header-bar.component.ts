import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Input() currentUser:any;
  userMenuOpen:boolean = false;

  constructor(private authService:AuthenticationService) { }

  ngOnInit(): void {}

  openUserMenu() { this.userMenuOpen = true }
  hideUserMenu() { this.userMenuOpen = false }
  
  logout() { this.authService.logout(); }
}
