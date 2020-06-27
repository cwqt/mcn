import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

enum IbmButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Ghost = "ghost",
  Danger = "danger",
  DangerPrimary = "danger--primary",
}

enum IbmButtonSize {
  Normal = "normal",
  Small = "sm",
  Field = "field",
}

@Component({
  selector: "app-load-button",
  templateUrl: "./load-button.component.html",
  styleUrls: ["./load-button.component.scss"],
})
export class LoadButtonComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() icon?: string;
  @Input() endIcon?: string;
  @Input() type?: IbmButtonType = IbmButtonType.Primary;
  @Input() size?: IbmButtonSize = IbmButtonSize.Normal;

  @Input() raised?: boolean;
  @Input() color?: string;

  @Output() onClick = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}

  click() {
    this.onClick.emit();
  }
}
