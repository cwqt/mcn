import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-load-button',
  templateUrl: './load-button.component.html',
  styleUrls: ['./load-button.component.scss']
})
export class LoadButtonComponent implements OnInit {
  @Input()  loading:boolean = false;
  @Input()  disabled:boolean = false;
  @Input()  color:string;
  @Output() onClick = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}
  
  click() {
    this.onClick.emit()
  }
}
