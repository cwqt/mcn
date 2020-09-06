import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { OrganisationService } from "src/app/services/organisation.service";
import { IDashboard, IOrg } from "@cxss/interfaces";
import { MatDialog } from "@angular/material/dialog";
import { CreateDashItemDialogComponent } from "./create-dash-item-dialog/create-dash-item-dialog.component";
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

  get dashboard() {
    return this.cache.dashboard.data;
  }

  constructor(
    private dialog: MatDialog,
    private orgService: OrganisationService
  ) {}

  ngOnInit(): void {
    this.orgService.currentOrg.subscribe((o) => (this.org = o));
    this.getDashboard();
  }

  ngAfterViewInit() {
    this.openAddDashItemDialog();
  }

  openAddDashItemDialog() {
    const dialogRef = this.dialog.open(CreateDashItemDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getDashboard();
    });
  }

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
