import { Measurement } from '../common/types/measurements.types';
import * as IpAddress from 'ip-address';

export enum RecordableTypes {
  Garden = 'garden',
  Plant = 'plant'
}

export interface IRecordableStub {
    _id:          string,
    name:         string,
    thumbnail?:   string,
    created_at?:  Date,
    type:         RecordableTypes.Garden | RecordableTypes.Plant,
}

export interface IRecordable extends IRecordableStub {
  images:         string[],
  recording?:     string[],
  feed_url?:      IpAddress.Address4 | IpAddress.Address6,
  verified:       boolean,
  parameters?:    Map<Measurement, [number, number, number]>, //lower, avg, upper bounds
  updated_at?:    Date,
}
