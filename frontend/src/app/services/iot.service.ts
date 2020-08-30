import { Injectable } from "@angular/core";
import {
  IMeasurementResult,
  IMeasurement,
  IAggregateData,
  IAggregateRequest,
} from "@cxss/interfaces";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class IoTService {
  constructor(private http: HttpClient) {}

  query(query: string): Promise<IMeasurementResult> {
    return this.http
      .get<IMeasurementResult>(`/api/iot/data?${query}`)
      .toPromise();
  }

  getAggregateData(body: IAggregateRequest): Promise<IAggregateData> {
    return this.http
      .post<IAggregateData>(`/api/iot/data/aggregate`, body)
      .toPromise();
  }
}
