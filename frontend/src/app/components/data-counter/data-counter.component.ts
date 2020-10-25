import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COLOR, COLOR_MAP, IAggregateRequest, IAggregateRequestGroup, IAggregateResponseGroup, IGraphNode, MeasurementInfo, MeasurementUnits, NodeType } from '@cxss/interfaces';
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
  @Output() requestChange:EventEmitter<IAggregateRequest> = new EventEmitter();

  measurements:IGraphNode[];
  aggregationCount:number = null;
  lastRequest:IAggregateRequest;
  hasValidData:boolean = false;
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

    //if selected a device, don't include all child properties since creator is sufficent
    //to capture all
    if(field == "sources") {
      console.log(selection)
    }

    // get count of data if all fields full
    this.aggregationCount = null;
    if(Object.values(this.selectedVariables).every(x => x !== null)) {
      this.loading = true;
      this.hasValidData = true;

      this.lastRequest = {
        _id: Types.ObjectId().toHexString(),
        recordable: `${this.selectedVariables.recordable.type}-${this.selectedVariables.recordable._id}`,
        data_format: MeasurementUnits[this.selectedVariables.measurement._id][0],
        measurement: this.selectedVariables.measurement._id,
        sources: this.selectedVariables.sources.map(x => `${x.type}-${x._id}`),
        color: <COLOR>(Object.values(COLOR)[Math.floor(Math.random() * Object.values(COLOR).length)]),
      }

      console.log(this.lastRequest)

      this.iotService.getAggregateDataCount({
        period:  "24hr",
        aggregation_points: [ this.lastRequest ]
      }).then(x => {
        this.aggregationCount = x;
        this.requestChange.emit(this.lastRequest);
      }).finally(() => this.loading = false)
    } else {
      this.hasValidData = false;
    }
  }
}
