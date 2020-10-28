import { INode } from "./Node.model";
import { IAggregateRequestGroup } from "./IoT/Aggregation.model";

export interface IDashboard extends INode {
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

// https://www.highcharts.com/docs/chart-and-series-types/chart-typess
export enum ChartType {
  Line = "line",
  Bar = "bar",
  Pie = "pie",
  HeatMap = "heatmap",
  Scatter = "scatter",
  Xrange = "xrange",  //state
}

export interface IDashboardItem extends INode {
  _id: string;
  title: string;
  position: { top: number; left: number; height: number; width: number };
  chart_type: ChartType;
  aggregation_request: IAggregateRequestGroup;
}
