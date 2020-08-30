import { Component, OnInit, Input } from "@angular/core";
import * as Highcharts from "highcharts";
import { INodeGraph } from "@cxss/interfaces";
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
  chartData;

  constructor() {}

  ngOnInit(): void {
    console.log(this.graph);

    this.chartData = {
      chart: {
        type: "networkgraph",
      },
      plotOptions: {
        networkgraph: {
          layoutAlgorithm: {
            enableSimulation: false,
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
            linkFormat: "{point.options.custom.relationship} \u2192",
            textPath: {
              enabled: true,
              attributes: {
                dy: 14,
                startOffset: "45%",
                textLength: 80,
              },
            },
            format: "Node: {point.name}",
          },
          marker: {
            radius: 35,
          },
          data: this.graph.data,
        },
      ],
    };
  }
}
