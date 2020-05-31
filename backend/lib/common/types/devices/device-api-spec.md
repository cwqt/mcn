# mcn device API specification

Three categories of data exist for a device; sensors, states and metrics.

* __Sensor__: Information about the environment or recordable: humidity, air temperature, soil moisture etc.
* __State__: Information about what the device controls: lights, water pumps, heaters etc.
* __Metrics__: Information about the device itself: power usage, signal strength, uptime etc.

Devices can have many sensors for the same measurement, as well as states & metrics, the API is designed to accommodate this.

## Device definition

Devices are internally reflected as `HardwareDevices`, see `/lib/common/types/hardware.types.ts` for information:

A device is described as:

```typescript
{
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
    }
    mcnEnabled: true,
    plantsSupported: 0,
} 
```

In order for `mcn` to communicate with your devices, a common API will be used, as follows:

## Requesting data from the device

For all sensors, states & metrics:

`GET http://host_url/`, should return a JSON of the form:

```json
{
    "sensors": {
        "light": { //Measurement.Light
            "photocell": 1422
        },
        "air_temperature": { //Measurement.AirTemperature
            "dht22temp": 18
        },
        "humidity": { //Measurement.Humidity
            "dht22humidity": 78
        },
        "moisture": { //Measurement.Moisture
            "capsoilsensor": 461
        }
    },
    "states": {
        "light_state": { // IoTState.LightState
            "light_1": true,
            "light_2": false
        }
    },
    "metrics": {
        "voltage": { // IoTMeasurement.Voltage
            "batteryvoltage": 4.8
        },
        "signal_strength": { // IoTMeasurement.SignalStrength
            "antenna": 231
        },
        "uptime": { // IoTMeasurement.Uptime
            "uptime": 123819
        }
    }
}
```

The string mapping of `ref` in the device spec. should be consistent in your devices response so that the measurements can be correctly matched.

## For specific types of measurements

### `GET http://host_url/sensors`

```json
{
    "light": { //Measurement.Light
        "photocell": 1422
    },
    "air_temperature": { //Measurement.AirTemperature
        "dht22temp": 18
    },
    "humidity": { //Measurement.Humidity
        "dht22humidity": 78
    },
    "moisture": { //Measurement.Moisture
        "capsoilsensor": 461
    }
}
```

And the same as above for: `http://host_url/states` & `http://host_url/metrics`.

## Setting state

Use the `IoTState` and state `id` to reference which state to toggle, e.g. turning on the main light on a device:

`POST http://host.ip/light_state/light_1`

```json
{
    "state":true
}
```