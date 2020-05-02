import { Hardware } from '../common/types/hardware.types';
import { Measurement, Unit } from '../common/types/measurements.types';
import * as IpAddress from 'ip-address';

export interface IDeviceStub {
    _id:string,
    name:string,
    thumbnail?:string
}

export interface IDevice extends IDeviceStub {
    images:             string[],
    verified:           boolean,
    hardware_model?:    Hardware,
    software_version?:  string,
    device_ip?:         IpAddress.Address4 | IpAddress.Address6,
    created_at?:        number,
    updated_at?:        number,
    recording?:         Array<Measurement>,
    units?:             Array<Unit>
}