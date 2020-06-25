import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tree-node",
  templateUrl: "./tree-node.component.html",
  styleUrls: ["./tree-node.component.scss"],
})
export class TreeNodeComponent implements OnInit {
  @Input() node;
  @Input() depth: number;
  opened: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.opened = this.node.children ? false : true;
  }

  toggleOpened() {
    if (this.node.children) this.opened = !this.opened;
  }
}
