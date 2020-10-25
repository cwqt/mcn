import { Injectable } from "@angular/core";
import {
  IMeasurementResult,
  IAggregateRequestGroup,
  IAggregateResponseGroup,
  IMeasurement,
} from "@cxss/interfaces";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class IoTService {
  constructor(private http: HttpClient) {}

  query(query: string): Promise<IMeasurement> {
    return this.http.get<IMeasurement>(`/api/iot/data?${query}`).toPromise();
  }

  getAggregateData(
    body: IAggregateRequestGroup
  ): Promise<IAggregateResponseGroup> {
    return this.http
      .post<IAggregateResponseGroup>(`/api/iot/aggregate`, body)
      .toPromise();
  }

  getAggregateDataCount(
    body: IAggregateRequestGroup
  ): Promise<number> {
    return this.http
      .post<number>(`/api/iot/aggregate/count`, body)
      .toPromise();
  }
}
