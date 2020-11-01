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
  IAggregateResponseGroup,
  ChartType,
  IAggregateAxis,
} from "@cxss/interfaces";

import {
  MeasurementInfo,
  MeasurementUnits,
  DataFormatInfo,
} from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { MatDialog, throwMatDialogContentAlreadyAttachedError } from "@angular/material/dialog";
import { DataCounterComponent } from '../data-counter/data-counter.component';
import { DataChartComponent } from '../data-chart/data-chart.component';
import { NumberInput } from '@angular/cdk/coercion';
import { Chart } from 'highcharts';

@Component({
  selector: "app-data-aggregator",
  templateUrl: "./data-aggregator.component.html",
  styleUrls: ["./data-aggregator.component.scss"],
})
export class DataAggregatorComponent implements OnInit {
  @ViewChild('counter') counter:DataCounterComponent;
  @ViewChild('chart') chart:DataChartComponent;

  @Input() aggregationRequest:IAggregateRequestGroup;
  @Input() editing: boolean = false;

  aggregationResponse:IAggregateResponseGroup;
  selectedAxis:IAggregateAxis<IAggregateRequest> | null;

  measurementInfo = MeasurementInfo;
  meaurementUnits = MeasurementUnits;
  dataFormatInfo = DataFormatInfo;
  colors = Object.values(COLOR);
  colorMap = COLOR_MAP;

  recordableGraph: IGraphNode[];
  sourceGraph: IGraphNode[];

  flatGraphList: { [index: string]: IGraphNode };

  editingPoints: string[] = [];
  chartType:{[index in ChartType]:string} = {
    [ChartType.Line]: 'chart--line',
    [ChartType.Bar]: 'chart--bar',
    [ChartType.HeatMap]: 'heat-map--03',
    [ChartType.Pie]: "chart--pie",
    [ChartType.Scatter]: "chart--scatter",
    [ChartType.Xrange]: "roadmap",

    [ChartType.Gauge]:"meter--alt",
    [ChartType.Value]:"string-integer"
  }

  constructor(
    private orgService: OrganisationService,
  ) {}

  ngOnInit(): void {
    if (!this.aggregationRequest) {
      this.aggregationRequest = {
        period: "24h",
        axes: [],
        chart_type: ChartType.Line
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

  createAxis(title:NumberInput) {
    this.aggregationRequest.axes = [...this.aggregationRequest.axes, {
      aggregation_points: [],
      title: title.toString(),
      label_format: Unit.Unknown
    }]

    this.selectAxis(this.aggregationRequest.axes[this.aggregationRequest.axes.length - 1]);
  }

  selectAxis(axis:IAggregateAxis<IAggregateRequest>) {
    this.selectedAxis = axis;
  }

  deselectAxis(axis:IAggregateAxis<IAggregateRequest>) {
    if(this.selectedAxis == axis) this.selectedAxis = null;
  }

  deleteAxis(axisIdx:any) {
    this.aggregationRequest.axes.splice(axisIdx as number, 1);
  }

  addRequest() {
    const axisIdx = this.aggregationRequest.axes.findIndex(a => a == this.selectedAxis);
    this.aggregationRequest.axes[axisIdx].aggregation_points = [
      ...this.aggregationRequest.axes[axisIdx].aggregation_points,
      this.counter.lastRequest
    ];

    this.chart.initialise(this.aggregationRequest);
  }

  setChartType(type:ChartType) {
    this.aggregationRequest.chart_type = type;
    this.chart.render();
  }

  setRequestColor(axisIdx:number, reqIdx:number) {}

  deleteRequest(axisIdx:number, reqIdx:number) {
    this.aggregationRequest.axes[axisIdx].aggregation_points.splice(
      reqIdx, 1
    );

    this.chart.initialise(this.aggregationRequest);
  }
}
