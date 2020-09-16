import { Component, OnInit, Input } from "@angular/core";
import {
  IAggregateRequestGroup,
  IRecordable,
  IGraphNode,
} from "@cxss/interfaces";

import {
  MeasurementInfo,
  MeasurementUnits,
  DataFormatInfo,
} from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";

@Component({
  selector: "app-data-aggregator",
  templateUrl: "./data-aggregator.component.html",
  styleUrls: ["./data-aggregator.component.scss"],
})
export class DataAggregatorComponent implements OnInit {
  @Input() aggregation_request?: IAggregateRequestGroup;
  @Input() editing: boolean = false;

  measurementInfo = MeasurementInfo;
  meaurementUnits = MeasurementUnits;
  dataFormatInfo = DataFormatInfo;

  recordableGraph: IGraphNode[];
  sourceGraph: IGraphNode[];

  // select recordable
  // select sources
  // select measurement
  // select unit
  // select colour
  // DONE!

  constructor(private orgService: OrganisationService) {}

  ngOnInit(): void {
    if (!this.aggregation_request) {
      this.aggregation_request = {
        period: "24h",
        aggregation_points: [],
      };
    }

    this.orgService
      .getRecordableGraph()
      .then((g) => (this.recordableGraph = g));
    this.orgService.getSourcesGraph().then((g) => (this.sourceGraph = g));
  }

  handleSourcesChange(event) {}
  handleRecordableChange(event) {}
}
