import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { COLOR, COLOR_MAP } from "@cxss/interfaces";

@Component({
  selector: "app-pick-color",
  templateUrl: "./pick-color.component.html",
  styleUrls: ["./pick-color.component.scss"],
})
export class PickColorComponent implements OnInit {
  @Output() selectedColor: EventEmitter<COLOR> = new EventEmitter();

  colors = Object.values(COLOR);
  colorMap = COLOR_MAP;

  constructor() {}

  ngOnInit(): void {
    console.log(this.colors.length);
  }

  selectColor(color: COLOR) {
    this.selectedColor.emit(color);
  }
}
