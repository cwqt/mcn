import { Component, OnInit, Input, ViewChild, ElementRef, } from '@angular/core';
import { Popover, PopoverProperties } from "../../../../assets/popover";
import { HeaderBarUserMenuComponent } from './header-bar-user-menu/header-bar-user-menu.component';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Input() currentUser:any;
  @ViewChild('hitBox') hitBox:ElementRef

  constructor(private popover:Popover) { }

  ngOnInit(): void {
  }

  openUserMenu() {
    this.popover.load({
      targetElement: this.hitBox.nativeElement,
      component: HeaderBarUserMenuComponent,
      offset: 16,
      width: '500px',
      placement: 'bottom-left',
    } as PopoverProperties)
  }

  hideUserMenu() { this.popover.close() }

}
