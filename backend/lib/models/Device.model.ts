import { SupportedHardware } from '../common/types/hardware.types';
import { Measurement, Unit } from '../common/types/measurements.types';
import { IApiKey }           from './ApiKey.model';
import { IRecordableStub }   from './Recordable.model';
import { IMeasurementModel } from './Measurement.model';
import { IPostableMeta }         from './Post.model';

import * as IpAddress from 'ip-address';
import { ISensor } from './Sensor.model';

export enum DeviceState {
    Active = "active",
    InActive = "inactive",
    Verified = "verified",
    UnVerified = "unverified"
}
  
export interface IDeviceStub {
    _id:            string,
    name:           string,
    short_desc?:    string,
    thumbnail?:     string,
    verified:       boolean,
    last_ping?:     number, //seconds since epoch device sent message
    created_at?:    number,
    state:          DeviceState,
    hardware_model: SupportedHardware,
    meta?:          IPostableMeta,
}

export interface IDevice extends IDeviceStub {
    images:             string[],
    software_version?:  string,
    measurement_count?: number,
    full_desc?:         string,
    device_ip?:         IpAddress.Address4 | IpAddress.Address6,
    api_key?:           IApiKey,
    assigned_to?:       IRecordableStub,
    sensors?:           ISensor[]
}