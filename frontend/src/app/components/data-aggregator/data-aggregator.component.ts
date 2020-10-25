import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  IAggregateRequestGroup,
  IRecordable,
  IGraphNode,
  IAggregateRequest,
  Unit,
  Measurement,
  COLOR_MAP,
  COLOR,
} from "@cxss/interfaces";

import {
  MeasurementInfo,
  MeasurementUnits,
  DataFormatInfo,
} from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { MatDialog } from "@angular/material/dialog";
import { DataCounterComponent } from '../data-counter/data-counter.component';

@Component({
  selector: "app-data-aggregator",
  templateUrl: "./data-aggregator.component.html",
  styleUrls: ["./data-aggregator.component.scss"],
})
export class DataAggregatorComponent implements OnInit {
  @ViewChild('counter') counter:DataCounterComponent;

  @Input() aggregation_request_group?: IAggregateRequestGroup;
  @Input() editing: boolean = false;

  aggregationRequests: IAggregateRequest[] = [];

  measurementInfo = MeasurementInfo;
  meaurementUnits = MeasurementUnits;
  dataFormatInfo = DataFormatInfo;
  colors = Object.values(COLOR);
  colorMap = COLOR_MAP;

  recordableGraph: IGraphNode[];
  sourceGraph: IGraphNode[];

  flatGraphList: { [index: string]: IGraphNode };

  editingPoints: string[] = [];

  // select recordable
  // select sources
  // select measurement
  // select unit
  // select colour
  // DONE!

  constructor(
    private orgService: OrganisationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.aggregation_request_group) {
      this.aggregation_request_group = {
        period: "24h",
        aggregation_points: [],
      };
    }


    Promise.all([
      this.orgService.getRecordableGraph(),
      this.orgService.getSourcesGraph(),
    ]).then((r) => {
      this.recordableGraph = r[0];
      this.sourceGraph = r[1];

      this.flatGraphList = [
        ...this.recordableGraph,
        ...this.sourceGraph,
      ].reduce((acc, curr) => {
        let f = (n: IGraphNode) => {
          acc[n._id] = n;
          n.children?.forEach((c) => f(c));
        };

        f(curr);
        return acc;
      }, {});
    });
  }

  handleSourcesChange(event) {}
  handleRecordableChange(event) {}

  addRequest() {
    this.aggregationRequests.push(this.counter.lastRequest);
  }


  pickColor(point: IAggregateRequest) {}

  deleteRequest(point: IAggregateRequest) {
    this.aggregationRequests.splice(
      this.aggregationRequests.findIndex((p) => p._id == point._id),
      1
    );
  }
}
