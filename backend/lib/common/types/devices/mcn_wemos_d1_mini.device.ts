import { Measurement, IoTMeasurement, Unit, IoTState } from "../measurements.types"
import { DeviceCapability, MicroController, HardwareDevice, Type } from '../../../models/Hardware.model';

const info:HardwareDevice = {
    model_name: "MCN Wemos D1 Mini",
    microcontroller: MicroController.ESP8266,
    capabilities: [
        DeviceCapability.WiFi,
        DeviceCapability.UPnP,
    ],
    sensors: {
        [Measurement.AirTemperature]:    { ref: "dht22temp",     unit: Unit.Celcius },
        [Measurement.Humidity]:          { ref: "dht22humidity", unit: Unit.RelativeHumidity },
        [Measurement.Light]:             { ref: "photocell",     unit: Unit.Lux },
        [Measurement.Moisture]:          { ref: "capsoilsensor", unit: Unit.CapacitiveMoisture },
    },
    states: {
        [IoTState.LightState]:           { ref: "light_1",       type: Type.Boolean },
        [IoTState.LightState]:           { ref: "light_2",       type: Type.Boolean },
    },
    metrics: {
        [IoTMeasurement.Voltage]:        { ref: "batteryvoltage", unit: Unit.Volts },
        [IoTMeasurement.SignalStrength]: { ref: "antenna",        unit: Unit.DecibelMilliWatts },
        [IoTMeasurement.Uptime]:         { ref: "uptime",         unit: Unit.Seconds }
    },
    mcnEnabled: true,
    plantsSupported: 0,

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
} 

export default info;