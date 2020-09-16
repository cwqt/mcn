import { Type } from "../IoT/Hardware.model";
import { IMeasurement } from "../IoT/Measurement.model";

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
  Camera = "camera", //special case of sending blob
  IRCamera = "ir_camera", //same but night-vision
}

//mapped from https://www.npmjs.com/package/convert-units
export enum Unit {
  Celcius = "C",
  Fahrenheit = "F",
  Kelvin = "K",

  Meters = "m",
  Centimeters = "cm",
  Feet = "ft",
  Inches = "in",

  Lux = "lx",
  FootCandle = "ft-cd",

  Volts = "V",
  MilliVolts = "mV",
  Amps = "A",
  MilliAmps = "mA",
  Watts = "W",
  MilliWatts = "mW",

  Pascal = "Pa",

  PartsPerMillion = "ppm",

  Seconds = "s",
  Minutes = "min",
  Hour = "h",
  Days = "d",
  Weeks = "week",
  Months = "month",
  Years = "year",

  Hz = "Hz",
  mHz = "mHz",
  kHz = "kHz",
  MHz = "MHz",
  GHz = "GHz",

  //non-convertable units
  pH = "pH",
  RelativeHumidity = "percentage",
  AbsoluteHumidity = "grams_per_meter_cubed",
  CapacitiveMoisture = "~",
  Percentage = "percentage",
  DecibelMilliWatts = "decibel_milli_watts", //wifi strength,
  EC = "milli_sievert_per_centi_meter",
  PAR = "milli_einstein",
  Unknown = "-",
}

export const NonConvertableUnits = [
  Unit.pH,
  Unit.RelativeHumidity,
  Unit.AbsoluteHumidity,
  Unit.CapacitiveMoisture,
  Unit.Percentage,
  Unit.DecibelMilliWatts,
  Unit.EC,
  Unit.DecibelMilliWatts,
  Unit.Unknown,
  ...Object.values(Type),
];

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
  [IoTState.Camera]: [Type.Image],
  [IoTState.IRCamera]: [Type.Image],
};

export interface IMeasurementInfo {
  title: string;
  icon?: string;
}

export const MeasurementInfo: {
  [index in Measurement | IoTMeasurement | IoTState]: IMeasurementInfo;
} = {
  [Measurement.AirTemperature]: { title: "Air temperature", icon: "temperature" },
  [Measurement.SoilTemperature]: { title: "Soil temperature", icon: "temperature" },
  [Measurement.Moisture]: { title: "Moisture", icon: "dew-point" },
  [Measurement.Humidity]: { title: "Humidity", icon: "humidity" },
  [Measurement.Light]: { title: "Light", icon: "light" },
  [Measurement.WaterLevel]: { title: "Water level", icon: "ruler" },
  [Measurement.pH]: { title: "pH", icon: "chemistry" },
  [Measurement.Height]: { title: "Height", icon: "ruler--alt" },
  [Measurement.AirPressure]: { title: "Air pressure", icon: "pressure" },
  [Measurement.PAR]: { title: "Photosynthetically active radiation", icon: "uv-index" },
  [Measurement.EC]: { title: "Electrical conductivity", icon: "lightning" },

  [IoTMeasurement.Voltage]: { title: "Voltage", icon: "plug" },
  [IoTMeasurement.Current]: { title: "Current", icon: "movement" },
  [IoTMeasurement.Power]: { title: "Power", icon: "plug--filled" },
  [IoTMeasurement.SignalStrength]: { title: "Signal strength", icon: "connection-signal" },
  [IoTMeasurement.Uptime]: { title: "Uptime", icon: "time" },
  [IoTMeasurement.ClockSpeed]: { title: "Clock speed", icon: "chip" },

  [IoTState.LightState]: { title: "Light state", icon: "not-available" },
  [IoTState.CameraState]: { title: "Camera state", icon: "not-available" },
  [IoTState.PumpState]: { title: "Pump state", icon: "not-available" },
  [IoTState.HeaterState]: { title: "Heater state", icon: "not-available" },
  [IoTState.FanState]: { title: "Fan state", icon: "not-available" },
  [IoTState.AireatorState]: { title: "Aireator state", icon: "not-available" },
  [IoTState.ScreenText]: { title: "Display text", icon: "not-available" },
  [IoTState.ActiveChildren]: { title: "Active children", icon: "not-available" },
  [IoTState.Camera]: { title: "Camera", icon: "not-available" },
  [IoTState.IRCamera]: { title: "IR Camera", icon: "not-available" },
};

export interface DataFormatInfo {
  symbol: string; // °C
  title: string; // Celcius
}

export const DataFormatInfo: { [index in Unit | Type]: DataFormatInfo } = {
  [Unit.Celcius]: { symbol: "°C", title: "Celcius" },
  [Unit.Fahrenheit]: { symbol: "°F", title: "Fahrenheit" },
  [Unit.Kelvin]: { symbol: "K", title: "Kelvin" },
  [Unit.Meters]: { symbol: "m", title: "Meters" },
  [Unit.Centimeters]: { symbol: "cm", title: "Centi-meters" },
  [Unit.Feet]: { symbol: "ft", title: "Feet" },
  [Unit.Inches]: { symbol: "in", title: "Inches" },
  [Unit.Lux]: { symbol: "lx", title: "Lux" },
  [Unit.FootCandle]: { symbol: "ft/cd", title: "Foot-Candela" },
  [Unit.Volts]: { symbol: "V", title: "Volts" },
  [Unit.MilliVolts]: { symbol: "mV", title: "Milli-volts" },
  [Unit.Amps]: { symbol: "A", title: "Amperes" },
  [Unit.MilliAmps]: { symbol: "mA", title: "Milli-Amperes" },
  [Unit.Watts]: { symbol: "W", title: "Watts" },
  [Unit.MilliWatts]: { symbol: "mW", title: "Milli-Watts" },
  [Unit.Pascal]: { symbol: "Pa", title: "Pascal" },
  [Unit.PartsPerMillion]: { symbol: "ppm", title: "Parts-per-million" },
  [Unit.Seconds]: { symbol: "s", title: "Seconds" },
  [Unit.Minutes]: { symbol: "min", title: "minutes" },
  [Unit.Hour]: { symbol: "hr", title: "Hours" },
  [Unit.Days]: { symbol: "d", title: "Days" },
  [Unit.Weeks]: { symbol: "wk", title: "Weeks" },
  [Unit.Months]: { symbol: "mo", title: "Months" },
  [Unit.Years]: { symbol: "yr", title: "Years" },
  [Unit.Hz]: { symbol: "Hz", title: "Hertz" },
  [Unit.mHz]: { symbol: "mHz", title: "Milli-hertz" },
  [Unit.kHz]: { symbol: "kHz", title: "Kilo-hertz" },
  [Unit.MHz]: { symbol: "MHz", title: "Mega-hertz" },
  [Unit.GHz]: { symbol: "GHz", title: "Giga-hertz" },
  [Unit.pH]: { symbol: "pH", title: "Power of Hydrogen" },
  [Unit.RelativeHumidity]: { symbol: "rh%", title: "Relative humidity" },
  [Unit.AbsoluteHumidity]: { symbol: "h%", title: "Humidity" },
  [Unit.CapacitiveMoisture]: { symbol: "--", title: "Capacitive moisture" },
  [Unit.Percentage]: { symbol: "%", title: "Percent" },
  [Unit.DecibelMilliWatts]: { symbol: "dBm", title: "Decibel-milliwatts" },
  [Unit.EC]: { symbol: "S/m", title: "Conductivity" },
  [Unit.PAR]: { symbol: "W/m2", title: "Photosynthetically active radiation" },
  [Unit.Unknown]: { symbol: "?", title: "Unknown" },
  [Type.Boolean]: { symbol: "b", title: "Boolean" },
  [Type.Number]: { symbol: "n", title: "Number" },
  [Type.String]: { symbol: "s", title: "String" },
  [Type.Image]: { symbol: "i", title: "Blob" },
};
