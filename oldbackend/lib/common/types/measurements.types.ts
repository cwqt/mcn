import { Type } from "../../models/Hardware.model";

//types of things that can be recorded
export enum Measurement {
  AirTemperature = "air_temperature",
  SoilTemperature = "soil_temperature",
  Moisture = "moisture",
  Humidity = "humidity",
  Light = "light",
  WaterLevel = "water_level",
  pH = "ph",
  Height = "height",
  AirPressure = "air_pressure",
  PAR = "par", // photosynthetically active radiation
  EC = "ec_level", // electrical conductivity
}

export enum IoTMeasurement {
  Voltage = "voltage",
  Current = "current",
  Power = "power",
  SignalStrength = "signal_strength",
  Uptime = "uptime",
  ClockSpeed = "clock_speed",
}

export enum IoTState {
  LightState = "light_state",
  CameraState = "camera_state",
  PumpState = "pump_state",
  HeaterState = "heater_state",
  FanState = "fan_state",
  AireatorState = "aireator_state",
  ScreenText = "screen_text",
  ActiveChildren = "active_children",
}

export enum Unit {
  Celcius = "°C",
  Fahrenheit = "°F",
  Kelvin = "K",
  Lux = "lx",
  RelativeHumidity = "RH%",
  AbsoluteHumidity = "g/m³",
  CapacitiveMoisture = "~",
  Percentage = "%",
  Meters = "m",
  Centimeters = "cm",
  Feet = "ft",
  Inches = "in",
  pH = "pH",
  Unknown = "-",
  Boolean = "",
  Volts = "V",
  MilliVolts = "mV",
  Amps = "A",
  MilliAmps = "mA",
  Watts = "W",
  MilliWatts = "mW",
  DecibelMilliWatts = "dBm", //wifi strength,
  Pascal = "Pa",
  EC = "mS/cm",
  PAR = "mEinstein",
  Seconds = "s",
  Minutes = "mins",
  Hour = "hrs",
  Days = "days",
  Weeks = "weeks",
  Months = "months",
  Hz = "Hz",
  MHz = "MHz",
  GHz = "GHz",
}

// available units for each measurement type are described:
export const MeasurementUnits: {
  [index in Measurement | IoTMeasurement | IoTState]: Array<Unit | Type>;
} = {
  [Measurement.PAR]: [Unit.PAR],
  [Measurement.EC]: [Unit.EC],
  [Measurement.AirTemperature]: [Unit.Celcius, Unit.Fahrenheit, Unit.Kelvin],
  [Measurement.SoilTemperature]: [Unit.Celcius, Unit.Fahrenheit, Unit.Kelvin],
  [Measurement.Moisture]: [Unit.CapacitiveMoisture],
  [Measurement.Humidity]: [Unit.RelativeHumidity, Unit.AbsoluteHumidity],
  [Measurement.Light]: [Unit.Lux],
  [Measurement.WaterLevel]: [Unit.Percentage],
  [Measurement.Height]: [Unit.Meters, Unit.Centimeters, Unit.Feet, Unit.Inches],
  [Measurement.pH]: [Unit.pH],
  [Measurement.AirPressure]: [Unit.Pascal],

  [IoTMeasurement.Voltage]: [Unit.Volts, Unit.MilliVolts],
  [IoTMeasurement.Current]: [Unit.Amps, Unit.MilliAmps],
  [IoTMeasurement.Power]: [Unit.Watts, Unit.MilliWatts],
  [IoTMeasurement.SignalStrength]: [Unit.DecibelMilliWatts],
  [IoTMeasurement.Uptime]: [Unit.Seconds], //seconds since unix epoch
  [IoTMeasurement.ClockSpeed]: [Unit.Hz, Unit.MHz, Unit.GHz],

  [IoTState.LightState]: [Type.Boolean], //on or off,
  [IoTState.CameraState]: [Type.Boolean],
  [IoTState.PumpState]: [Type.Boolean],
  [IoTState.HeaterState]: [Type.Boolean],
  [IoTState.FanState]: [Type.Boolean],
  [IoTState.AireatorState]: [Type.Boolean],
  [IoTState.ScreenText]: [Type.String],
  [IoTState.ActiveChildren]: [Type.Number],
};

export const MeasurementConversions: {
  [index: string]: (input: number) => number;
} = {
  [`${Unit.Meters}-${Unit.Feet}`]: (meters: number): number => {
    return meters * 3.281;
  },
};
