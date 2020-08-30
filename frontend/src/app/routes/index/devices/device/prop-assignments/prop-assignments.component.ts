import { Component, OnInit, Input } from "@angular/core";
import * as Highcharts from "highcharts";
import {
  INodeGraph,
  NodeType,
  IDevice,
  INodeGraphItem,
} from "@cxss/interfaces";
import networkgraph from "highcharts/modules/networkgraph";
networkgraph(Highcharts);

@Component({
  selector: "app-prop-assignments",
  templateUrl: "./prop-assignments.component.html",
  styleUrls: ["./prop-assignments.component.scss"],
})
export class PropAssignmentsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required

  @Input() graph: INodeGraph;
  @Input() device: IDevice;
  chartData;

  constructor() {}

  chart;
  filteredGraph: INodeGraphItem[];

  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    console.log(this.chart);
    setTimeout(() => {
      this.chart.reflow();
    }, 0);
  }

  ngOnInit(): void {
    const colourMap = {
      [NodeType.Sensor]: "#da7294",
      [NodeType.State]: "#579480",
      [NodeType.Metric]: "#a5abb6",
      [NodeType.Device]: "#56c7e3",
      [NodeType.Farm]: "#f16667",
      [NodeType.Rack]: "#ffc454",
      [NodeType.Crop]: "#8dcc93",
    };

    this.filteredGraph = this.graph.data.filter((x) => {
      let type = x.from.split("-")[0];
      if ([NodeType.Sensor, NodeType.State].includes(type as NodeType))
        return true;
      return false;
    });

    let graph = this.graph as any; //for formatter context binding
    graph.data = graph.data.map((x) => {
      x.id = x.to;
      return x;
    });

    graph.nodes = graph.data.map((x) => {
      let type = x.to.split("-")[0];
      return {
        id: x.to,
        color: colourMap[type],
        marker: { radius: 20 },
      };
    });
    graph.nodes.push({
      id: `${NodeType.Device}-${this.device._id}`,
      color: colourMap[NodeType.Device],
      marker: { radius: 35 },
    });

    console.log(graph);

    this.chartData = {
      chart: {
        type: "networkgraph",
        events: {
          render: function () {
            this.reflow();
          },
        },
      },
      title: null,
      plotOptions: {
        networkgraph: {
          layoutAlgorithm: {
            enableSimulation: true,
            initialPositionRadius: 2,
            linkLength: 35,
          },
        },
      },

      series: [
        {
          dataLabels: {
            enabled: true,
            linkTextPath: {
              attributes: {
                dy: 12,
              },
              enabled: true,
            },
            linkFormat: "{point.options.custom.relationship}",
            textPath: {
              enabled: true,
              attributes: {
                dy: -2,
              },
            },
            formatter: function (_) {
              //function bind to highcharts
              return graph.sources[this.key].name;
            },
          },
          data: graph.data,
          nodes: graph.nodes,
        },
      ],
    };
  }
}
