import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { OrganisationService } from "src/app/services/organisation.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  cache = {
    dashboard: {
      data: null,
      editing: false,
    },
  };

  position = { top: 2, left: 2, height: 1, width: 1 };

  get dashboard() {
    return this.cache.dashboard.data;
  }

  constructor(private orgService: OrganisationService) {}

  ngOnInit(): void {
    this.cache.dashboard.data = {
      rows: 3,
      columns: 6,
      items: [
        {
          title: "first dashboard item!",
          position: { top: 1, left: 1, width: 2, height: 2 },
          data: [],
          sources: [],
          type: "line-graph",
        },
      ],
    };
  }

  ngAfterViewInit() {}

  addToGrid() {}

  getDashboard() {}

  onWidgetChange(event) {
    console.log(event);
  }

  toggleEditState() {
    if (this.cache.dashboard.editing) {
      console.log("saving state");
    }
    this.cache.dashboard.editing = !this.cache.dashboard.editing;
  }

  cancelEdit() {
    this.cache.dashboard.editing = false;
  }
}
