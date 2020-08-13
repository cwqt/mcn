import { Component, OnInit } from "@angular/core";
import { GridOptions } from "muuri";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  blockItems: string[] = ["test", "test2"];

  // Add any options you'd like to set here
  public layoutConfig: GridOptions = {
    items: [],
    layoutOnInit: false,
    dragEnabled: true,
    layout: {
      fillGaps: true,
      horizontal: false,
      alignRight: false,
      alignBottom: false,
      rounding: true,
    },
  };

  constructor() {}

  ngOnInit(): void {}

  addToGrid() {
    this.blockItems.push("hello");
  }
}
