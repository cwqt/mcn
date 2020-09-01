import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileService } from "./profile.service";
import { UserService } from "./user.service";

import {
  MeasurementUnits,
  IDevice,
  IDeviceStub,
  ITaskRoutine,
  IApiKey,
  IApiKeyPrivate,
  NodeType,
  IDeviceProperty,
  IFlatNodeGraph,
} from "@cxss/interfaces";
import { BehaviorSubject } from "rxjs";
import { tap, delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DeviceService {
  availableMeasurements = MeasurementUnits;
  isLoadingDevice: BehaviorSubject<boolean> = new BehaviorSubject(false);
  lastActiveDevice: BehaviorSubject<IDevice> = new BehaviorSubject(null);

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

  getDevice(device_id: string): Promise<IDevice> {
    this.isLoadingDevice.next(true);
    return this.http
      .get<IDevice>(`/api/devices/${device_id}`)
      .pipe(
        delay(1000),
        tap((d) => {
          this.lastActiveDevice.next(d);
          this.isLoadingDevice.next(false);
        })
      )
      .toPromise();
  }

  getDeviceStatus(device_id: string): Promise<any> {
    return this.http
      .get<IDevice>(`/api/devices/${device_id}/status`)
      .toPromise();
  }

  getMeasurements(user_id: string, device_id: string) {
    return this.http
      .get(`/api/users/${user_id}/devices/${device_id}/measurements`)
      .toPromise();
  }

  getTaskRoutines(user_id: string, device_id: string): Promise<ITaskRoutine[]> {
    return this.http
      .get<ITaskRoutine[]>(
        `/api/users/${user_id}/devices/${device_id}/routines`
      )
      .toPromise();
  }

  getPropertyAssignmentsGraph(device_id: string): Promise<IFlatNodeGraph> {
    return this.http
      .get<IFlatNodeGraph>(`/api/devices/${device_id}/properties/graph`)
      .toPromise();
  }

  assignManyProperties(
    device_id: string,
    assignments: { [property: string]: string }
  ) {
    return this.http
      .post(`/api/devices/${device_id}/properties/assign`, assignments)
      .toPromise();
  }

  getDeviceProperties(
    propType: NodeType.Sensor | NodeType.State | NodeType.Metric,
    device_id: string
  ): Promise<IDeviceProperty<any>[]> {
    switch (propType) {
      case NodeType.Sensor:
        return this.http
          .get<IDeviceProperty<NodeType.Sensor>[]>(
            `/api/devices/${device_id}/sensors`
          )
          .toPromise();
      case NodeType.State:
        return this.http
          .get<IDeviceProperty<NodeType.State>[]>(
            `/api/devices/${device_id}/states`
          )
          .toPromise();
      case NodeType.Metric:
        return this.http
          .get<IDeviceProperty<NodeType.Metric>[]>(
            `/api/devices/${device_id}/metrics`
          )
          .toPromise();
    }
  }
}
