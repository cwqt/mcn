import { Measurement, IoTMeasurement, Unit, IoTState } from "../measurements.types"
import { DeviceCapability, MicroController, HardwareDevice, Type } from '../../../models/Hardware.model';

const info:HardwareDevice = {
    model_name: "MCN Wemos D1 Mini",
    microcontroller: MicroController.ESP8266,
    capabilities: [
        DeviceCapability.WiFi,
        DeviceCapability.UPnP,
    ],
    sensors: [
        { type: Measurement.AirTemperature,   ref: "dht22temp",     unit: Unit.Celcius },
        { type: Measurement.Humidity,         ref: "dht22humidity", unit: Unit.RelativeHumidity },
        { type: Measurement.Light,            ref: "photocell",     unit: Unit.Lux },
        { type: Measurement.Moisture,         ref: "capsoilsensor", unit: Unit.CapacitiveMoisture },        
    ],
    states: [
        { type: IoTState.LightState,          ref: "light_1",        unit: Type.Boolean },
        { type: IoTState.LightState,          ref: "light_2",        unit: Type.Boolean }
    ],
    metrics: [
        { type:IoTMeasurement.Voltage,        ref: "batteryvoltage", unit: Unit.Volts },
        { type:IoTMeasurement.SignalStrength, ref: "antenna",        unit: Unit.DecibelMilliWatts },
        { type:IoTMeasurement.Uptime,         ref: "uptime",         unit: Unit.Seconds }        
    ],
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