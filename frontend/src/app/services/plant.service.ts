import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { IMeasurementModel } from '../../../../backend/lib/models/Measurement.model';
import { IPlant } from '../../../../backend/lib/models/Plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}

  getMeasurements(user_id:string, plant_id:string):Promise<IMeasurementModel[]> {
    return this.http.get<IMeasurementModel[]>(`/api/users/${user_id}/plants/${plant_id}/measurements`).toPromise()
  }

  getPlant(user_id:string, plant_id:string):Promise<IPlant> {
    return this.http.get<IPlant>(`/api/users/${user_id}/plants/${plant_id}`).toPromise()
  }
}
