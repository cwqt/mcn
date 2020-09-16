import { Component, OnInit } from "@angular/core";

import { MeasurementInfo, MeasurementUnits } from "@cxss/interfaces";

@Component({
  selector: "ui-testbed",
  templateUrl: "./testbed.component.html",
  styleUrls: ["./testbed.component.scss"],
})
export class TestbedComponent implements OnInit {
  textString: string = "cass";
  numberString: number = 1;
  boolString: boolean = true;

  measurements = MeasurementInfo;
  units = MeasurementUnits;

  constructor() {}

  ngOnInit(): void {}
}
