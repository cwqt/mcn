//types of things that can be recorded
export enum Measurement {
    Temperature = 'temperature',
    Moisture = 'moisture',
    Humidity = 'humidity',
    Light = 'light',
    WaterLevel = 'water_level',
    LightState = 'light_state',
    CameraState = 'camera_state',
    PumpState = 'pump_state',
    HeaterState = 'heater_state',
}

export enum Unit {
    Celcius = "°C",
    Fahrenheit = "°F",
    Kelvin = "K",
    Lux = "lx",
    RelativeHumidity = "RH%",
    AbsoluteHumidity = "g/m³",
    CapacitiveMoisture = '~',
    Percentage = '%'
}

// available units for each measurement type are described: 
export const MeasurementTypes:{[index in Measurement]:Array<Unit | boolean>} = {
    [Measurement.Temperature]:  [Unit.Celcius, Unit.Fahrenheit, Unit.Kelvin],
    [Measurement.Moisture]:     [Unit.CapacitiveMoisture],
    [Measurement.Humidity]:     [Unit.RelativeHumidity, Unit.AbsoluteHumidity],
    [Measurement.Light]:        [Unit.Lux],
    [Measurement.WaterLevel]:   [Unit.Percentage],
    [Measurement.LightState]:   [true, false], //on or off,
    [Measurement.CameraState]:  [true, false],
    [Measurement.PumpState]:    [true, false],
    [Measurement.HeaterState]:  [true, false]
}
