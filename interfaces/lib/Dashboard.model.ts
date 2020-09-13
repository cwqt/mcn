import { INode } from "./Node.model";
import { IAggregateRequestGroup } from "./IoT/Aggregation.model";

export interface IDashboard extends INode {
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

export enum ChartType {
  "line-graph",
  "heat-map",
  "state",
}

export interface IDashboardItem extends INode {
  title: string;
  position: { top: number; left: number; height: number; width: number };
  chart_type: ChartType;
  aggregation_request: IAggregateRequestGroup;
}
