import { NodeType } from "@cxss/interfaces";

import DeviceProperty from "../classes/IoT/DeviceProperty.model";
import Device from "../classes/IoT/Device.model";
import User from "../classes/Users/User.model";
import Farm from "../classes/Hydroponics/Farm.model";
import Org from "./Orgs.model";
import RackModel from "./Hydroponics/Rack.model";
import CropModel from "./Hydroponics/Crop.model";
import SpeciesModel from "./Hydroponics/Species.model";

const nodeMap: { [index in NodeType]?: any } = {
  [NodeType.Organisation]: Org,
  [NodeType.User]: User,
  [NodeType.Device]: Device,
  [NodeType.Sensor]: DeviceProperty,
  [NodeType.State]: DeviceProperty,
  [NodeType.Metric]: DeviceProperty,
  [NodeType.Farm]: Farm,
  [NodeType.Rack]: RackModel,
  [NodeType.Crop]: CropModel,
  [NodeType.Species]: SpeciesModel,
};

export default nodeMap;
