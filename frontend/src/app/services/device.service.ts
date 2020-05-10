import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

import { MeasurementUnits } from '../../../../backend/lib/common/types/measurements.types';
import { IDevice } from '../../../../backend/lib/models/Device.model';
import { IMeasurementModel } from '../../../../backend/lib/models/Measurement.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  availableMeasurements = MeasurementUnits;

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {
  }

  getAvailableMeasurements = () => {
    return this.availableMeasurements;
  }

  createDevice(user_id, content) {
    return this.http.post(`/api/users/${user_id}/devices`, content)
  }

  getDevice(user_id, device_id):Promise<IDevice> {
    return this.http.get<IDevice>(`/api/users/${user_id}/devices/${device_id}`).toPromise();
  }

  getLatestMeasurement(user_id, device_id):Promise<IMeasurementModel> {
    return this.http.get<IMeasurementModel>(`/api/users/${user_id}/devices/${device_id}/measurements?page=1&per_page=1`).toPromise();
  }

  getMeasurements(user_id, device_id) {
    return this.http.get(`/api/users/${user_id}/devices/${device_id}/measurements`).toPromise();
  }
}
