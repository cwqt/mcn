import { Injectable } from "@angular/core";
import { PostableType } from "../imports";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PostableService {
  constructor(private http: HttpClient) {}

  heartItem(
    type: PostableType,
    user_id: string,
    item_id: string
  ): Promise<any> {
    return this.http
      .post(`/api/users/${user_id}/${type}s/${item_id}/heart`, null)
      .toPromise();
  }

  unheartItem(
    type: PostableType,
    user_id: string,
    item_id: string
  ): Promise<any> {
    return this.http
      .delete(`/api/users/${user_id}/${type}s/${item_id}/heart`)
      .toPromise();
  }
}
