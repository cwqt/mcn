import { Measurement, Unit, IoTMeasurement } from './measurements.types';

enum MicroController {
    ESP8266 = "ESP-8266",
    ESP32 = "ESP-32"
}

enum DeviceCapability {
    Bluetooth = "Bluetooth",
    UPnP = "UPnP",
    WiFi = "WiFi",
    LightState = "LightState"
}

export enum SupportedHardware {
    MCNWemosD1Mini = "mcn_wemos_d1_mini",
    MCNEsp32 = "mcn_esp32",
}

export interface HardwareDevice {
    model_name:      string,
    microcontroller: MicroController,
    recording:       {[index in (Measurement | IoTMeasurement)]?:Unit},
    capabilities:    DeviceCapability[],
    mcnEnabled:      boolean,
    supportsPlants:  boolean,
    maxPlantsSupported?:     number
}

export const HardwareInformation:{[index in SupportedHardware]:HardwareDevice} = {
    [SupportedHardware.MCNWemosD1Mini]: {
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
            DeviceCapability.LightState
        ],
        mcnEnabled: true,
        supportsPlants: false
    },
    [SupportedHardware.MCNEsp32]: {
        model_name: "MCN ESP32 Garden",
        microcontroller: MicroController.ESP32,
        recording: {
            [Measurement.AirTemperature]:   Unit.Celcius,
            [Measurement.Humidity]:         Unit.RelativeHumidity,
            [Measurement.Light]:            Unit.Lux,
            [Measurement.Moisture]:         Unit.CapacitiveMoisture,
            [Measurement.WaterLevel]:       Unit.Percentage,
            [Measurement.Humidity]:         Unit.RelativeHumidity,
            [IoTMeasurement.LightState]:    Unit.Boolean,
            [IoTMeasurement.CameraState]:   Unit.Boolean,
        },
        capabilities: [
            DeviceCapability.WiFi
        ],
        mcnEnabled: false,
        supportsPlants: true,
        maxPlantsSupported: 8
    }
}