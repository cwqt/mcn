import { INode } from "./Node.model";
import { IAggregateRequestGroup } from "./IoT/Aggregation.model";

export interface IDashboard extends INode {
  title:string;
  icon?:string;
  sections: IDashboardSection[];
}

export interface IDashboardSection {
  _id:string;
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

export interface IDashboardItem extends INode {
  _id: string;
  title: string;
  position: { top: number; left: number; height: number; width: number };
  aggregation_request: IAggregateRequestGroup;
}

// https://www.highcharts.com/docs/chart-and-series-types/chart-typess
export enum ChartType {
  Line = "line",
  Bar = "bar",
  Pie = "pie",
  HeatMap = "heatmap",
  Scatter = "scatter",
  Xrange = "xrange",  //state
  Gauge = "gauge",
  Value = "value" // non-highcharts
}
