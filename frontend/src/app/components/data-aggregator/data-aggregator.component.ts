import { Component, OnInit, Input } from "@angular/core";
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
import { SelectRecordableDialogComponent } from "./select-recordable-dialog/select-recordable-dialog.component";
import { SelectSourcesDialogComponent } from "./select-sources-dialog/select-sources-dialog.component";
import { SelectMeasurementDialogComponent } from "./select-measurement-dialog/select-measurement-dialog.component";

interface IFeAggregationRequest extends IAggregateRequest {
  editing: boolean;
}

@Component({
  selector: "app-data-aggregator",
  templateUrl: "./data-aggregator.component.html",
  styleUrls: ["./data-aggregator.component.scss"],
})
export class DataAggregatorComponent implements OnInit {
  @Input() aggregation_request_group?: IAggregateRequestGroup;
  @Input() editing: boolean = false;

  fe_aggregation_requests: IFeAggregationRequest[] = [];

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

    // deep clone aggregation requests
    // map into something that can be manipulated for editing purposes
    this.fe_aggregation_requests = JSON.parse(
      JSON.stringify(this.aggregation_request_group.aggregation_points)
    ).map((x: IAggregateRequest) => {
      let y = x as IFeAggregationRequest;
      y.editing = false;
      return y;
    });

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

    this.orgService
      .getRecordableGraph()
      .then((g) => (this.recordableGraph = g));
      
    this.orgService.getSourcesGraph().then((g) => (this.sourceGraph = g));
  }

  handleSourcesChange(event) {}
  handleRecordableChange(event) {}

  onCounterChange(){}

  editRequest(point: IFeAggregationRequest) {
    this.fe_aggregation_requests.forEach((p) => (p.editing = false));
    point.editing = true;
  }

  editMeasurement(point: IFeAggregationRequest) {
    const dialogRef = this.dialog.open(SelectMeasurementDialogComponent, {
      data: this.measurementInfo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      point.sources = result;
    });
  }

  editSources(point: IFeAggregationRequest) {
    const dialogRef = this.dialog.open(SelectSourcesDialogComponent, {
      data: {
        graph: this.sourceGraph,
        flatGraph: this.flatGraphList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      point.sources = result;
    });
  }

  editRecordable(point: IFeAggregationRequest) {
    const dialogRef = this.dialog.open(SelectRecordableDialogComponent, {
      data: {
        graph: this.recordableGraph,
        flatGraph: this.flatGraphList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      point.recordable = result[0];
    });
  }

  pickColor(point: IFeAggregationRequest) {}

  deleteRequest(point: IFeAggregationRequest) {
    this.fe_aggregation_requests.splice(
      this.fe_aggregation_requests.findIndex((p) => p._id == point._id),
      1
    );
  }
}
