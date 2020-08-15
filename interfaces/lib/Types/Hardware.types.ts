import { SupportedHardware, HardwareDevice } from "../IoT/Hardware.model";

import MCNWemosD1Mini from "./Devices/mcn_wemos_d1_mini.device";
import ESP32WithCamera from "./Devices/esp32_w_cam.device";

export const HardwareInformation: {
  [index in SupportedHardware]: HardwareDevice;
} = {
  [SupportedHardware.MCNWemosD1Mini]: MCNWemosD1Mini,
  [SupportedHardware.ESP32Cam]: ESP32WithCamera,
};
