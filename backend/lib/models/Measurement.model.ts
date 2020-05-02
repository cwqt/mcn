import { Measurement } from "../common/types/measurements.types";

export interface IMeasurement {
    _id:            string,
    measurements:   Array<{[index in Measurement]:number | string | boolean}>,
    created_at?:    Date,
}

// example data packet
// {
//     _id: '5ead6fa9de75a68ea1acc4a1',
//     created_at: 1588424694404,
//     device_id: '5ead701d5dfd5ef70e085ef3
//     measurements: {
//         temperature: 13,
//         moisture: 87,
//         light: 4202,
//         camera_state: false,
//         pump_state: true,
//     }
// }