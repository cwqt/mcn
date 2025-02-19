import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IGraphNode, IFlatNodeGraph } from "@cxss/interfaces";
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { BehaviorSubject } from "rxjs";

export class IFlatGraphNode {
  _id: string;
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: "app-graph-selector",
  templateUrl: "./graph-selector.component.html",
  styleUrls: ["./graph-selector.component.scss"],
})
export class GraphSelectorComponent implements OnInit {
  @Input() graph: IGraphNode[];
  @Input() selectMany = false;
  @Output() selectionChange: EventEmitter<IGraphNode[]> = new EventEmitter();

  activeSelection: IGraphNode[];

  dataChange = new BehaviorSubject<IGraphNode[]>([]);
  get data(): IGraphNode[] {
    return this.dataChange.value;
  }

  flatNodeMap = new Map<IFlatGraphNode, IGraphNode>();
  nestedNodeMap = new Map<IGraphNode, IFlatGraphNode>();
  treeControl: FlatTreeControl<IFlatGraphNode>;
  treeFlattener: MatTreeFlattener<IGraphNode, IFlatGraphNode>;
  dataSource: MatTreeFlatDataSource<IGraphNode, IFlatGraphNode>;
  checklistSelection: SelectionModel<IFlatGraphNode>;

  getLevel = (node: IFlatGraphNode) => node.level;
  isExpandable = (node: IFlatGraphNode) => node.expandable;
  getChildren = (node: IGraphNode): IGraphNode[] => node.children;
  hasChild = (_: number, _nodeData: IFlatGraphNode) => _nodeData.expandable;

  transformer = (node: IGraphNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode._id === node._id
        ? existingNode
        : ({} as IFlatGraphNode);
    flatNode._id = node._id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: IFlatGraphNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: IFlatGraphNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  untoggleAll(node) {
    this.treeControl.dataNodes.forEach((n) => {
      if (n._id !== node._id) {
        this.treeControl.collapse(n);
      }
    });
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  graphNodeSelectionToggle(node: IFlatGraphNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    // for multi select only
    if (this.checklistSelection.isMultipleSelection()) {
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
    }

    // Force update for the parent
    descendants.every((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: IFlatGraphNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: IFlatGraphNode): void {
    let parent: IFlatGraphNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: IFlatGraphNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);

    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: IFlatGraphNode): IFlatGraphNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    console.log(this.treeControl, this.treeControl.dataNodes);
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<IFlatGraphNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit(): void {
    console.log('-->', this.selectMany)
    this.checklistSelection = new SelectionModel<IFlatGraphNode>(
      this.selectMany
    );
    this.dataSource.data = this.graph;
    console.log(this.treeControl);
  }

  getSelection(): IFlatGraphNode[] {
    return this.checklistSelection.selected;
  }
}
