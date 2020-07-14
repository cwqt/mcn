import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileService } from "./profile.service";
import { UserService } from "./user.service";

import {
  MeasurementUnits,
  IDevice,
  IDeviceStub,
  IDeviceState,
  IDeviceSensor,
  ITaskRoutine,
  IApiKey,
  IApiKeyPrivate,
} from "@cxss/interfaces";

@Injectable({
  providedIn: "root",
})
export class DeviceService {
  availableMeasurements = MeasurementUnits;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  getAvailableMeasurements = () => {
    return this.availableMeasurements;
  };

  createDevice(user_id: string, content): Promise<IDevice> {
    return this.http
      .post<IDevice>(`/api/users/${user_id}/devices`, content)
      .toPromise();
  }

  createApiKey(
    user_id: string,
    device_id: string,
    data: any
  ): Promise<IApiKeyPrivate> {
    return this.http
      .post<IApiKeyPrivate>(
        `/api/users/${user_id}/devices/${device_id}/keys`,
        data
      )
      .toPromise();
  }

  getDevice(user_id: string, device_id: string): Promise<IDevice> {
    return this.http.get<IDevice>(`/api/devices/${device_id}`).toPromise();
  }

  getLatestMeasurement(user_id: string, device_id: string) {
    // return this.http
    //   .get<IMeasurementModel>(
    //     `/api/users/${user_id}/devices/${device_id}/measurements?page=1&per_page=1`
    //   )
    //   .toPromise();
  }

  getMeasurements(user_id: string, device_id: string) {
    return this.http
      .get(`/api/users/${user_id}/devices/${device_id}/measurements`)
      .toPromise();
  }

  requestMeasurementsUpdate(user_id: string, device_id: string) {}

  getTaskRoutines(user_id: string, device_id: string): Promise<ITaskRoutine[]> {
    return this.http
      .get<ITaskRoutine[]>(
        `/api/users/${user_id}/devices/${device_id}/routines`
      )
      .toPromise();
  }

  getDeviceStates(user_id: string, device_id: string): Promise<IDeviceState[]> {
    return this.http
      .get<IDeviceState[]>(`/api/users/${user_id}/devices/${device_id}/states`)
      .toPromise();
  }

  getDeviceSensors(
    user_id: string,
    device_id: string
  ): Promise<IDeviceSensor[]> {
    return this.http
      .get<IDeviceSensor[]>(
        `/api/users/${user_id}/devices/${device_id}/sensors`
      )
      .toPromise();
  }
}
