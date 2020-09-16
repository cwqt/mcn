import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IGraphNode } from "@cxss/interfaces";

@Component({
  selector: "app-graph-selector",
  templateUrl: "./graph-selector.component.html",
  styleUrls: ["./graph-selector.component.scss"],
})
export class GraphSelectorComponent implements OnInit {
  @Input() graph: IGraphNode[];
  @Input() selectMany: boolean = false;
  @Output() selectionChange: EventEmitter<IGraphNode[]> = new EventEmitter();

  activeSelection: IGraphNode[];

  constructor() {}

  ngOnInit(): void {}

  unselectNode(node) {
    //this is only for selectMany when checkboxes are used
  }

  selectNode(node) {
    if (!this.selectMany) {
      this.activeSelection = [node]; //only one at a time
    }
  }
}
