import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { RecordableType } from '../../../../backend/lib/models/Recordable.model';
import { RecorderType } from '../../../../backend/lib/models/Measurement.model';

@Injectable({
  providedIn: 'root'
})
export class RecordableService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}

  heartItem(type:RecordableType, user_id:string, item_id:string):Promise<any> {
    console.log(`/api/users/${user_id}/${type}s/${item_id}`)
    return this.http.post(`/api/users/${user_id}/${type}s/${item_id}/heart`, null).toPromise()
  }

  unheartItem(type:RecordableType, user_id:string, item_id:string):Promise<any> {
    return this.http.delete(`/api/users/${user_id}/${type}s/${item_id}/heart`).toPromise()
  }
}
