import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAggregateRequest, IAggregateRequestGroup, IAggregateResponseGroup, IGraphNode, MeasurementInfo, MeasurementUnits, NodeType } from '@cxss/interfaces';
import { Types } from 'mongoose';
import { IoTService } from 'src/app/services/iot.service';
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
  aggregationCount:number = null;
  loading:boolean = false;

  constructor(private iotService:IoTService) { }

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

  selectedVariables = {
    ["measurement"]: null,
    ["recordable"]: null,
    ["sources"]: null,
  }

  async handleSelectionChange(selection:IGraphNode[], field:"measurement" | "recordable" | "sources") {
    this.selectedVariables[field] = field == "sources" ? selection : selection[0];

    // get count of data if all fields full
    this.aggregationCount = null;
    if(Object.values(this.selectedVariables).every(x => x !== null)) {
      this.loading = true;

      this.iotService.getAggregateDataCount({
        period:  "24hr",
        aggregation_points: [
          {
            _id: Types.ObjectId().toHexString(),
            recordable: `${this.selectedVariables.recordable.type}-${this.selectedVariables.recordable._id}`,
            data_format: MeasurementUnits[this.selectedVariables.measurement._id][0],
            measurement: this.selectedVariables.measurement._id,
            sources: this.selectedVariables.sources.map(x => `${x.type}-${x._id}`)
          }
        ]
      }).then(x => this.aggregationCount = x)
        .finally(() => this.loading = false)
    }
  }
}
