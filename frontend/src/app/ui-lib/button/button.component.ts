import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "ui-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit {
  @Input() click: Function;
  @Input() tooltip?: string;
  @Input() style?:
    | "primary"
    | "secondary"
    | "accent"
    | "warn"
    | "disabled"
    | "basic" = "basic";

  constructor() {}

  ngOnInit(): void {}
  onClick() {
    this.click();
  }
}
