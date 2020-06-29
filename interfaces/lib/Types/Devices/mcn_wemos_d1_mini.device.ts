import { Measurement, IoTMeasurement, Unit, IoTState } from "../Measurements.types";
import { DeviceCapability, MicroController, HardwareDevice, Type } from "../../IoT/Hardware.model";

const info: HardwareDevice = {
  model_name: "MCN Wemos D1 Mini",
  network_name: "mcn-wd1m",
  microcontroller: MicroController.ESP8266,
  capabilities: [DeviceCapability.WiFi, DeviceCapability.UPnP],
  sensors: {
    ["dht22temp"]: { type: Measurement.AirTemperature, unit: Unit.Celcius },
    ["dht22humidity"]: {
      type: Measurement.Humidity,
      unit: Unit.RelativeHumidity,
    },
    ["photocell"]: { type: Measurement.Light, unit: Unit.Lux },
    ["capsoilsensor"]: {
      type: Measurement.Moisture,
      unit: Unit.CapacitiveMoisture,
    },
  },
  states: {
    ["light_1"]: { type: IoTState.LightState, unit: Type.Boolean },
    ["light_2"]: { type: IoTState.LightState, unit: Type.Boolean },
    ["screen_display"]: { type: IoTState.ScreenText, unit: Type.String },
    ["pumps"]: { type: IoTState.FanState, unit: Type.Number },
  },
  metrics: {
    ["batteryvoltage"]: { type: IoTMeasurement.Voltage, unit: Unit.Volts },
    ["antenna"]: {
      type: IoTMeasurement.SignalStrength,
      unit: Unit.DecibelMilliWatts,
    },
    ["uptime"]: { type: IoTMeasurement.Uptime, unit: Unit.Seconds },
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
};

export default info;
