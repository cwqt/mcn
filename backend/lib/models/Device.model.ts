import { SupportedHardware } from '../common/types/hardware.types';
import { Measurement, Unit } from '../common/types/measurements.types';
import { IApiKey }           from './ApiKey.model';
import { IRecordableStub }   from './Recordable.model';
import { IMeasurementModel } from './Measurement.model';
import { IPostableMeta }         from './Post.model';

import * as IpAddress from 'ip-address';

export enum DeviceState {
    Active = "active",
    InActive = "inactive",
    Verified = "verified",
    UnVerified = "unverified"
}
  
export interface IDeviceStub {
    _id:            string,
    name:           string,
    thumbnail?:     string,
    verified:       boolean,
    state:          DeviceState,
    last_ping?:     number //seconds since epoch device sent message
    hardware_model: SupportedHardware,
    created_at?:    number,
    meta?:          IPostableMeta
}

export interface IDevice extends IDeviceStub {
    images:             string[],
    software_version?:  string,
    device_ip?:         IpAddress.Address4 | IpAddress.Address6,
    measurement_count?: number
    api_key?:           IApiKey,
    assigned_to?:       IRecordableStub,
}