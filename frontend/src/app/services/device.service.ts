import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}

  createDevice(user_id, content) {
    return this.http.post(`/api/users/${user_id}/devices`, content)
  }

  getDevice(user_id, device_id) {
    return this.http.get(`/api/users/${user_id}/devices/${device_id}`).toPromise();
  }

  getLatestMeasurement(user_id, device_id) {
    return this.http.get(`/api/users/${user_id}/devices/${device_id}/latest`).toPromise();
  }

  getMeasurements(user_id, device_id) {
    return this.http.get(`/api/users/${user_id}/devices/${device_id}/measurements`).toPromise();
  }
}
