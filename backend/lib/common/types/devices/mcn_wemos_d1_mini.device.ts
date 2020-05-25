import { Measurement, IoTMeasurement, Unit } from "../measurements.types"
import { DeviceCapability, MicroController, HardwareDevice, HttpMethod } from '../hardware.types';
import { Type } from "../hardware.types";

const info:HardwareDevice = {
    model_name: "MCN Wemos D1 Mini",
    microcontroller: MicroController.ESP8266,
    recording: {
        [Measurement.AirTemperature]:    Unit.Celcius,
        [Measurement.Humidity]:          Unit.RelativeHumidity,
        [Measurement.Light]:             Unit.Lux,
        [Measurement.Moisture]:          Unit.CapacitiveMoisture,
        [IoTMeasurement.Voltage]:        Unit.Volts,
        [IoTMeasurement.SignalStrength]: Unit.DecibelMilliWatts
    },
    capabilities: [
        DeviceCapability.WiFi,
        DeviceCapability.UPnP,
    ],
    // e.g. http://81.3.12.443/light_state
    api: {
        [IoTMeasurement.LightState]: {
            [HttpMethod.Get]: {
                description: 'Read current light state',
            },
            [HttpMethod.Post]: {
                description: "Turn on/off all the lights",
                body: {
                    "state": {type: Type.Boolean, required: true}
                },    
            },
            // children: {
            //         ["big_light"]: {
            //             [HttpMethod.Post]: {
            //                 description: "Turn off the big light",
            //                 body: {
            //                     "state": {type: Type.Boolean, required: true}
            //                 }
            //             } 
            //         }
            // }
        }
    },
    mcnEnabled: true,
    plantsSupported: 0,
} 

export default info;