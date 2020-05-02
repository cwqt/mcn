export enum Measurement {
    Temperature = 'temperature',
    Moisture = 'moisture',
    Humidity = 'humidity',
    Light = 'light',
    WaterLevel = 'water_level',
    LightState = 'light_state'
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

export const MeasurementTypes:{[index in Measurement]:Array<Unit | boolean>} = {
    [Measurement.Temperature]:  [Unit.Celcius, Unit.Fahrenheit, Unit.Kelvin],
    [Measurement.Moisture]:     [Unit.CapacitiveMoisture],
    [Measurement.Humidity]:     [Unit.RelativeHumidity, Unit.AbsoluteHumidity],
    [Measurement.Light]:        [Unit.Lux],
    [Measurement.WaterLevel]:   [Unit.Percentage],
    [Measurement.LightState]:   [true, false]
}
