import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGraphNode, MeasurementInfo, NodeType } from '@cxss/interfaces';
import { IFlatGraphNode } from '../graph-selector/graph-selector.component';

@Component({
  selector: 'app-data-counter',
  templateUrl: './data-counter.component.html',
  styleUrls: ['./data-counter.component.scss']
})
export class DataCounterComponent implements OnInit {
  @Input() recordables: IGraphNode[];
  @Input() sources: IGraphNode[];
  @Output() dataChange = new EventEmitter();

  measurements:IGraphNode[];

  constructor() { }

  ngOnInit(): void {
    // devices can also haved data recorded on them, clone all sources & remove props
    // & only allow devices through
    this.recordables = this.recordables.concat(this.sources.map(x => {
      x = {...x};
      x.children = [];
      return x;
    }).filter(x => x.type == NodeType.Device));

    // map measurements into IGraphNode & add the icon
    this.measurements = Object.entries(MeasurementInfo).map(([k, v]) => ({
      name: v.title,
      _id: k,
      type: null,
      icon: v.icon
    }))
  }

  handleSelectionChange(selection:IGraphNode[], field:"measurement" | "recordable" | "sources") {
    console.log(field, ' --> ', selection)
  }
}
