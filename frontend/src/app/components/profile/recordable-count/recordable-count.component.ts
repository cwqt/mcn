import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recordable-count',
  templateUrl: './recordable-count.component.html',
  styleUrls: ['./recordable-count.component.css']
})
export class RecordableCountComponent implements OnInit {
  @Input() icon:string;
  @Input() title:string;
  @Input() count:number;
  @Input() user:string;

  @Output() changeRecordableTab = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  navigate() {
    this.changeRecordableTab.emit(this.title);
  }
}
