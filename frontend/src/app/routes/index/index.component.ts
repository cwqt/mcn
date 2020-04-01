import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  currentUser:any;
  constructor(private router:Router, private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      if(this.currentUser) {
        console.log('already logged in')
        if(this.currentUser.new_user) {
          console.log('needs to do first time stuff')
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }

}
