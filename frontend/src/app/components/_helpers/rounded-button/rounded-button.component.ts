import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rounded-button',
  templateUrl: './rounded-button.component.html',
  styleUrls: ['./rounded-button.component.scss']
})
export class RoundedButtonComponent implements OnInit {
  @Input()  icon:string;
  @Input()  disabled:boolean = false;
  @Input()  color:string;
  @Output() onClick = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}
  
  click() {
    this.onClick.emit()
  }
}
