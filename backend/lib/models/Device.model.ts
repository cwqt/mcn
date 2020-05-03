import { Hardware }          from '../common/types/hardware.types';
import { Measurement, Unit } from '../common/types/measurements.types';
import { IApiKey }           from './ApiKey.model';
import { IRecordableStub }   from './Recordable.model';
import { IMeasurementModel } from './Measurement.model';

import * as IpAddress from 'ip-address';

export enum DeviceState {
    Active = "active",
    InActive = "inactive",
    Verified = "verified",
    UnVerified = "unverified"
}
  
export interface IDeviceStub {
    _id:        string,
    name:       string,
    thumbnail?: string,
    verified:   boolean,
    state:      DeviceState,
    last_ping?: number //seconds since epoch device sent message
}

export interface IDevice extends IDeviceStub {
    images:             string[],
    created_at?:        number,
    hardware_model?:    Hardware,
    software_version?:  string,
    device_ip?:         IpAddress.Address4 | IpAddress.Address6,
    units?:             Array<Unit>,
    recording?:         Array<Measurement>,
    measurement_count?: number
}

//uses mongo data
export interface IDeviceCollated extends IDevice {
    api_key?:           IApiKey,
    assigned_to?:       IRecordableStub,
    latest_data?:       IMeasurementModel
}

//all contained within neo4j
export interface IDeviceMeta {
    api_key?:           IApiKey,
    assigned_to?:       IRecordableStub,
    created_at?:        number,
    hardware_model?:    Hardware,
    software_version?:  string,
    device_ip?:         IpAddress.Address4 | IpAddress.Address6,
    units?:             Array<Unit>,
    recording?:         Array<Measurement>,
    state:              DeviceState
}
