import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { IFarmStub, Paginated, IFarm } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.scss"],
})
export class FarmListComponent implements OnInit {
  @Output() selectedFarm: EventEmitter<IFarmStub> = new EventEmitter();

  farms = {
    data: <IFarmStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["name", "_id", "last_ping", "state"],
  };

  model: any;

  constructor(private orgService: OrganisationService) {}

  ngOnInit(): void {
    console.log("getting devices");
    this.farms.loading = true;
    this.orgService
      .getFarms()
      .then((paginated: Paginated<IFarmStub>) => {
        this.farms.data = paginated.results;
      })
      .catch((e) => (this.farms.error = e))
      .finally(() => (this.farms.loading = false));
  }

  openFarmDetail(farm: IFarmStub) {
    this.selectedFarm.emit(farm);
  }
}
