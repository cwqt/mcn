import { Injectable } from "@angular/core";
import { IFarm } from "@cxss/interfaces";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class FarmService {
  constructor(private http: HttpClient) {}

  getFarm(farm_id: string): Promise<IFarm> {
    return this.http.get<IFarm>(`/api/farms/${farm_id}`).toPromise();
  }
}
