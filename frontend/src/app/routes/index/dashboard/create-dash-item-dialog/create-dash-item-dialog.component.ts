import { Component, OnInit } from "@angular/core";
import { chart } from "highcharts";
import { IDashboardItem, NodeType, ChartType } from "@cxss/interfaces";

@Component({
  selector: "app-create-dash-item-dialog",
  templateUrl: "./create-dash-item-dialog.component.html",
  styleUrls: ["./create-dash-item-dialog.component.scss"],
})
export class CreateDashItemDialogComponent implements OnInit {
  loading: boolean = false;

  dashItem: Omit<IDashboardItem, "_id" | "created_at"> = {
    title: "",
    position: {
      top: 0,
      left: 0,
      width: 2,
      height: 1,
    },
    chart_type: ChartType["line-graph"],
    type: NodeType.DashboardItem,
    aggregation_request: {
      period: "24hr",
      aggregation_points: {},
    },
  };

  chartTypes = {
    ["line"]: { selected: false, icon: "chart--line" },
    ["value"]: { selected: false, icon: "string-integer" },
    ["heatmap"]: { selected: false, icon: "heat-map--03" },
  };

  constructor() {}

  ngOnInit(): void {}

  addItem() {}
  cancel() {}

  setChartType(chartKey: string) {
    Object.values(this.chartTypes).forEach((x) => (x.selected = false));
    this.chartTypes[chartKey].selected = true;
  }

  asIsOrder() {
    return 1;
  }
}
