import { Component, OnInit, HostListener, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';  
import { UserService } from 'src/app/services/user.service';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { trigger, state, transition, style, animate } from '@angular/animations';  
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit {
  currentUser:any;

  lastY:number;
  ticking:boolean;

  @ViewChild('scroll') scroll:ElementRef;
  @ViewChild(HeaderBarComponent) header;

  constructor(private userService:UserService, @Inject(DOCUMENT) document) {
    this.userService.currentUser.subscribe(user => this.currentUser = user );
  }

  ngOnInit(): void {
  }
}
