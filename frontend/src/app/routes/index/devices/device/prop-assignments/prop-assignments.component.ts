import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as Highcharts from "highcharts";
import {
  IFlatNodeGraph,
  NodeType,
  IDevice,
  IFlatNodeGraphItem,
  IFlorableGraph,
} from "@cxss/interfaces";
import networkgraph from "highcharts/modules/networkgraph";
import { MatDialog } from "@angular/material/dialog";
import { PropAssignDialogComponent } from "./prop-assign-dialog/prop-assign-dialog.component";
import { DeviceService } from "src/app/services/device.service";
networkgraph(Highcharts);

const colourMap = {
  [NodeType.Sensor]: "#da7294",
  [NodeType.State]: "#579480",
  [NodeType.Metric]: "#a5abb6",
  [NodeType.Device]: "#56c7e3",
  [NodeType.Farm]: "#f16667",
  [NodeType.Rack]: "#ffc454",
  [NodeType.Crop]: "#8dcc93",
};

@Component({
  selector: "app-prop-assignments",
  templateUrl: "./prop-assignments.component.html",
  styleUrls: ["./prop-assignments.component.scss"],
})
export class PropAssignmentsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  device: IDevice;
  florableGraph: IFlorableGraph;
  graph: IFlatNodeGraph;

  loading: boolean;
  error: string;
  assignmentGraph: { [property: string]: string } = {};
  chartData; //Highcharts.Options //bad typing

  constructor(private deviceService: DeviceService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.device = this.deviceService.lastActiveDevice.getValue();
    this.initialise();
  }

  async initialise() {
    await this.getPropAssignmentsGraph();
    //get the mapping between sources & recordables
    this.assignmentGraph = Object.keys(this.graph.sources).reduce(
      (acc, curr) => {
        let type = curr.split("-")[0];
        if ([NodeType.State, NodeType.Sensor].includes(type as NodeType)) {
          acc[curr] =
            this.graph.data.find(
              (x) => x.from == curr && x.to !== `device-${this.device._id}`
            )?.to || "Not assigned";
        }
        return acc;
      },
      {}
    );

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
            enableSimulation: false, //too laggy
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

  getPropAssignmentsGraph(isRefresh?: boolean, event?) {
    this.loading = true;
    return this.deviceService
      .getPropertyAssignmentsGraph(this.device._id)
      .then((res) => {
        if (event) this.assignmentGraph[event[0]] = event[1];
        this.graph = res;
      })
      .catch((e) => (this.error = e))
      .finally(() => (this.loading = false));
  }

  openAssignmentDialog(property: string, recordable: string) {
    const dialogRef = this.dialog.open(PropAssignDialogComponent, {
      data: {
        property: property,
        recordable: recordable,
        sources: this.graph.sources,
        device: this.device,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && `${result.type}-${result?._id}` !== recordable) {
        //assignment change
        this.getPropAssignmentsGraph(true, [
          property,
          `${result.type}-${result?._id}`,
        ]);
      }
    });
  }
}
