import { SupportedHardware, Type } from '../Hardware.model';
import { Measurement, Unit, IoTState, IoTMeasurement } from '../../common/types/measurements.types';
import { IApiKey }           from './ApiKey.model';
import { IRecordableStub }   from '../Recordable.model';
import { IPostableMeta }         from '../Post.model';

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
}

interface IDeviceProperty {
    _id: string,
    ref: string,
    value: string | number | boolean,
    name: string,
    description: string,
}

export interface IDeviceSensor extends IDeviceProperty {
    measures:       Measurement | IoTMeasurement,
    unit:           Unit
}

export interface IDeviceState extends IDeviceProperty {
    state:           IoTState,
    type:            Type,
}

