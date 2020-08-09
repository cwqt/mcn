import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import * as Highcharts from "highcharts";

import {
  IDevice,
  IDeviceStub,
  IUser,
  IDeviceProperty,
  NodeType,
} from "@cxss/interfaces";

import { DeviceService } from "src/app/services/device.service";

interface Cacheable<T> {
  data: T;
  loading: boolean;
  error: string;
  expandedElement: any;
}

const genInts = () => {
  let ints = [];
  for (let i = 0; i < 500; i++) {
    ints.push(Math.sin(2 * (i / 20)) + Math.sin(Math.PI * (i / 20)));
  }
  return ints;
};

@Component({
  selector: "app-property-list",
  templateUrl: "./property-list.component.html",
  styleUrls: ["./property-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class PropertyListComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options = {
    title: null,
    xAxis: {},
    series: [
      {
        name: "Relative Humidity (%)",
        data: [...genInts()],
        type: "line",
      },
    ],
  };

  @Input() currentUser: IUser;
  @Input() authorUser: IUser;
  @Input() device: IDeviceStub;

  columnsToDisplay = ["_id", "name", "ref", "value"];

  cache: {
    [NodeType.Sensor]: Cacheable<IDeviceProperty<NodeType.Sensor>[]>;
    [NodeType.State]: Cacheable<IDeviceProperty<NodeType.State>[]>;
    [NodeType.Metric]: Cacheable<IDeviceProperty<NodeType.Metric>[]>;
  } = {
    [NodeType.Sensor]: {
      data: [],
      loading: false,
      error: "",
      expandedElement: null,
    },
    [NodeType.State]: {
      data: [],
      loading: false,
      error: "",
      expandedElement: null,
    },
    [NodeType.Metric]: {
      data: [],
      loading: false,
      error: "",
      expandedElement: null,
    },
  };

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    console.log(this.device);
  }

  ngAfterViewInit() {
    this.getProperty(NodeType.Sensor); //first tab
  }

  pretty(str: string) {
    return (str.charAt(0).toUpperCase() + str.slice(1)).replace("_", " ");
  }

  getProperty(propType: NodeType.State | NodeType.Sensor | NodeType.Metric) {
    console.log("fuuuc");
    this.cache[propType].loading = true;
    this.deviceService
      .getDeviceProperties(propType, this.device._id)
      .then((props) => {
        this.cache[propType].data = props;
      })
      .catch((e) => (this.cache[propType].error = e))
      .finally(() => (this.cache[propType].loading = false));
  }
}
