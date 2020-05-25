import { Measurement, Unit } from '../common/types/measurements.types';

export interface ISensor {
    _id:            string,
    measures:       Measurement,
    unit:           Unit
    created_at:     number,
    name:           string,
    description?:   string,
}