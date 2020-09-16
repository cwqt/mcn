import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";

@Component({
  selector: "app-tree-node",
  templateUrl: "./tree-node.component.html",
  styleUrls: ["./tree-node.component.scss"],
})
export class TreeNodeComponent implements OnInit {
  @Input() activeNode;
  @Input() node;
  @Input() depth: number;
  @Output() selectedNode = new EventEmitter();

  opened: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.opened = this.node.children ? false : true;
  }

  toggleOpened() {
    if (this.node.children) this.opened = !this.opened;
  }

  onClick(event, node) {
    // console.log(node);
    event?.stopPropagation();
  }

  emit(n) {
    console.log(n);
    this.selectedNode.emit(n);
  }
}
