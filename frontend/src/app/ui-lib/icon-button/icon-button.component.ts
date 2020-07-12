import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "ui-icon-button",
  templateUrl: "./icon-button.component.html",
  styleUrls: ["./icon-button.component.scss"],
})
export class IconButtonComponent implements OnInit {
  @Input() style: string;
  @Input() size: string;
  @Input() tooltip?: string;

  constructor() {}

  ngOnInit(): void {}
}
