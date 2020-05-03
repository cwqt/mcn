import { Hardware }          from '../common/types/hardware.types';
import { Measurement, Unit } from '../common/types/measurements.types';
import { IApiKey }           from './ApiKey.model';
import { IRecordableStub }   from './Recordable.model';
import { IMeasurementModel } from './Measurement.model';

import * as IpAddress from 'ip-address';

export interface IDeviceStub {
    _id:        string,
    name:       string,
    thumbnail?: string,
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
    verified:           boolean,
    api_key?:           IApiKey,
    assigned_to?:       IRecordableStub,
    latest_data?:       IMeasurementModel
}