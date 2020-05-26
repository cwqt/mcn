import { Measurement, IoTMeasurement, Unit, IoTState } from "../measurements.types"
import { DeviceCapability, MicroController, HardwareDevice, HttpMethod } from '../hardware.types';
import { Type } from "../hardware.types";
import { IoTSecureTunneling } from "aws-sdk";

const info:HardwareDevice = {
    model_name: "MCN Wemos D1 Mini",
    microcontroller: MicroController.ESP8266,
    capabilities: [
        DeviceCapability.WiFi,
        DeviceCapability.UPnP,
    ],
    sensors: {
        [Measurement.AirTemperature]:    Unit.Celcius,
        [Measurement.Humidity]:          Unit.RelativeHumidity,
        [Measurement.Light]:             Unit.Lux,
        [Measurement.Moisture]:          Unit.CapacitiveMoisture,
        [IoTMeasurement.Voltage]:        Unit.Volts,
        [IoTMeasurement.SignalStrength]: Unit.DecibelMilliWatts
    },
    states: {
        [IoTState.LightState]: "main_light",
        [IoTState.LightState]: "backup_light",
    },
    // e.g. http://81.3.12.443/light_state
    // api: {
    //     [IoTMeasurement.LightState]: {
    //         [HttpMethod.Get]: {
    //             description: 'Read current light state',
    //         },
    //         [HttpMethod.Post]: {
    //             description: "Turn on/off all the lights",
    //             body: {
    //                 "state": {type: Type.Boolean, required: true}
    //             },    
    //         },
    //         // children: {
    //         //         ["big_light"]: {
    //         //             [HttpMethod.Post]: {
    //         //                 description: "Turn off the big light",
    //         //                 body: {
    //         //                     "state": {type: Type.Boolean, required: true}
    //         //                 }
    //         //             } 
    //         //         }
    //         // }
    //     }
    // },
    mcnEnabled: true,
    plantsSupported: 0,
} 

export default info;