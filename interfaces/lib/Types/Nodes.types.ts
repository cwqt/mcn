export enum NodeType {
  User = "user",
  Organisation = "organisation",
  Farm = "farm",
  Rack = "rack",
  Crop = "crop",
  Device = "device",
  Post = "post",
  DeviceProperty = "deviceProp",
  Metric = "metric",
  Sensor = "sensor",
  State = "state",
  TaskSeries = "task_series",
  TaskRoutine = "task_routine",
  Task = "task",
}

//adding measurements / getting of / constructing graphs
export type RecordableType = NodeType.Device | NodeType.Farm | NodeType.Rack | NodeType.Crop;

//posts, pinning
export type PostableType =
  | NodeType.Post
  | NodeType.Device
  | NodeType.Farm
  | NodeType.Crop
  | NodeType.Rack;

//hydroponics stuff
export type Florable = NodeType.Farm | NodeType.Rack | NodeType.Crop;

//adding / removing to/from org
export enum OrgItemType {
  User = NodeType.User,
  Farm = NodeType.Farm,
  Rack = NodeType.Rack,
  Crop = NodeType.Crop,
  Device = NodeType.Device,
}

export enum OrgRole {
  Owner,
  Admin,
  Viewer,
}
