import { Injectable } from "@angular/core";
import { ChartType, IAggregateRequest, IDashboardItem } from "@cxss/interfaces";
import { HttpClient } from "@angular/common/http";
import { OrganisationService } from "./organisation.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(
    private orgService: OrganisationService,
    private http: HttpClient
  ) {}

  addItem(
    title: string,
    position: { [index: string]: number },
    chartType: ChartType,
    aggregation_req: IAggregateRequest
  ): Promise<IDashboardItem> {
    return this.http
      .post<IDashboardItem>(
        `/api/orgs/${this.orgService.orgId}/dashboard/items`,
        {
          title: title,
          position: position,
          chart_type: chartType,
          aggregation_request: aggregation_req,
        }
      )
      .toPromise();
  }
}
