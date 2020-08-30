import { Component, OnInit, Input } from "@angular/core";
import { IDashboardItem } from "@cxss/interfaces";
import { IoTService } from "src/app/services/iot.service";

@Component({
  selector: "app-dashboard-item",
  templateUrl: "./dashboard-item.component.html",
  styleUrls: ["./dashboard-item.component.scss"],
})
export class DashboardItemComponent implements OnInit {
  @Input() item: IDashboardItem;

  cache = {
    aggregateData: {
      data: null,
      loading: false,
      error: false,
    },
  };

  constructor(private iotService: IoTService) {}

  ngOnInit(): void {}

  getAggregateData() {
    this.cache.aggregateData.loading = true;
    this.iotService.getAggregateData(this.item.aggregation_request);
  }
}
