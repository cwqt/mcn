import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { OrganisationService } from "src/app/services/organisation.service";
import { IDashboard, IOrg } from "@cxss/interfaces";
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
      loading: false,
      error: "",
    },
  };

  org: IOrg;

  position = { top: 2, left: 2, height: 1, width: 1 };

  get dashboard() {
    return this.cache.dashboard.data;
  }

  constructor(private orgService: OrganisationService) {}

  ngOnInit(): void {
    this.orgService.currentOrg.subscribe((o) => (this.org = o));
    this.getDashboard();
  }

  ngAfterViewInit() {}

  addToGrid() {}

  getDashboard() {
    this.cache.dashboard.loading = true;
    this.orgService
      .getDashboard()
      .then((d: IDashboard) => {
        this.cache.dashboard.data = d;
      })
      .catch((e) => (this.cache.dashboard.error = e.message))
      .finally(() => (this.cache.dashboard.loading = false));
  }

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
