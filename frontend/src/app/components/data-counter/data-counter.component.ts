import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGraphNode } from '@cxss/interfaces';

@Component({
  selector: 'app-data-counter',
  templateUrl: './data-counter.component.html',
  styleUrls: ['./data-counter.component.scss']
})
export class DataCounterComponent implements OnInit {
  @Input() recordables: IGraphNode[];
  @Input() sources: IGraphNode[];
  @Output() dataChange = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
    console.log(this.recordables, this.sources)
  }

}
