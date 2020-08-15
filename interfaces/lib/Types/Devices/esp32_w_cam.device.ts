import { Measurement, IoTMeasurement, Unit, IoTState } from "../Measurements.types";
import {
  DeviceCapability,
  MicroController,
  HardwareDevice,
  Type,
  HttpMethod,
} from "../../IoT/Hardware.model";

const info: HardwareDevice = {
  model_name: "ESP32-CAM",
  network_name: "esp32-cam",
  mcnEnabled: true,
  plantsSupported: 0,
  microcontroller: MicroController.ESP32,
  capabilities: [DeviceCapability.WiFi, DeviceCapability.UPnP],
  sensors: {},
  states: {
    ["camera"]: {
      type: IoTState.CameraState,
      unit: Type.Image,
    },
  },
  metrics: {
    ["wifi"]: {
      type: IoTMeasurement.SignalStrength,
      unit: Unit.DecibelMilliWatts,
    },
    ["uptime"]: { type: IoTMeasurement.Uptime, unit: Unit.Seconds },
  },
  api: {
    ["camera"]: {
      [HttpMethod.Get]: {
        description: "Request image",
      },
    },
  },
};

export default info;
