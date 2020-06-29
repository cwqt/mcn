import MCNWemosD1Mini from "./Devices/mcn_wemos_d1_mini.device";
import { SupportedHardware, HardwareDevice } from "../IoT/Hardware.model";

export const HardwareInformation: {
  [index in SupportedHardware]: HardwareDevice;
} = {
  [SupportedHardware.MCNWemosD1Mini]: MCNWemosD1Mini,
};
