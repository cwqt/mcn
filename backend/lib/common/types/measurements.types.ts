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
    pH = 'ph',
    Height = 'height',
}

export enum IoTMeasurement {
    Voltage = 'voltage',
    Current = "current",
    Power = "power",
    SignalStrength = "signal_strength"
}

export enum Unit {
    Celcius = "°C",
    Fahrenheit = "°F",
    Kelvin = "K",
    Lux = "lx",
    RelativeHumidity = "RH%",
    AbsoluteHumidity = "g/m³",
    CapacitiveMoisture = '~',
    Percentage = '%',
    Meters = 'm',
    Centimeters = 'cm',
    Feet = 'ft',
    Inches = 'in',
    pH = 'pH',
    Unknown = "-",
    Boolean = "{on, off}",
    Volts = "V",
    MilliVolts = "mV",
    Amps = "A",
    MilliAmps = "mA",
    Watts = "W",
    MilliWatts = "mW",
    DecibelMilliWatts = "dBm", //wifi strength
}

// available units for each measurement type are described: 
export const MeasurementTypes:{[index in (Measurement | IoTMeasurement)]:Array<Unit | boolean>} = {
    [Measurement.Temperature]:       [Unit.Celcius, Unit.Fahrenheit, Unit.Kelvin],
    [Measurement.Moisture]:          [Unit.CapacitiveMoisture],
    [Measurement.Humidity]:          [Unit.RelativeHumidity, Unit.AbsoluteHumidity],
    [Measurement.Light]:             [Unit.Lux],
    [Measurement.WaterLevel]:        [Unit.Percentage],
    [Measurement.LightState]:        [true, false], //on or off,
    [Measurement.CameraState]:       [true, false],
    [Measurement.PumpState]:         [true, false],
    [Measurement.HeaterState]:       [true, false],
    [Measurement.Height]:            [Unit.Meters, Unit.Centimeters, Unit.Feet, Unit.Inches],
    [Measurement.pH]:                [Unit.pH],
    [IoTMeasurement.Voltage]:        [Unit.Volts, Unit.MilliVolts],
    [IoTMeasurement.Current]:        [Unit.Amps, Unit.MilliAmps],
    [IoTMeasurement.Power]:          [Unit.Watts, Unit.MilliWatts],
    [IoTMeasurement.SignalStrength]: [Unit.DecibelMilliWatts],
}

export const MeasurementConversions:{[index:string]:((input:number) => number)} =  {
    [`${Unit.Meters}-${Unit.Feet}`]: (meters:number):number => {
        return meters * 3.281;
    }
}