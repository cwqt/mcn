import { cypher, sessionable } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import {
  NodeType,
  IApiKey,
  SupportedHardware,
  IDeviceStub,
  IDevice,
  DeviceStateType,
  HardwareInformation,
  DataModel,
  IRecordable,
  IDeviceProperty,
} from "@cxss/interfaces";

import Recordable from "../Hydroponics/Recordable.model";
import Node from "../Node.model";

const create = async (
  creator_id: string,
  data: IDeviceStub,
  states: IDeviceProperty<NodeType.State>[],
  sensors: IDeviceProperty<NodeType.Sensor>[],
  metrics: IDeviceProperty<NodeType.Metric>[]
): Promise<IDevice> => {
  let device = await sessionable(async (t: Transaction) => {
    let res = await t.run(
      `
      MATCH (u:User {_id:$uid})
      CREATE (d:Device $body)<-[:CREATED]-(u)
      FOREACH (sensor in $sensors | CREATE (s:Sensor)<-[:HAS_SENSOR]-(d) SET s=sensor)
      FOREACH (metric in $metrics | CREATE (m:Metric)<-[:HAS_METRIC]-(d) SET m=metric)
      FOREACH (state in $states | CREATE (s:State)<-[:HAS_STATE]-(d) SET s=state)
      RETURN d
    `,
      {
        uid: creator_id,
        body: data,
        states: states,
        metrics: metrics,
        sensors: sensors,
      }
    );

    let device: IDevice = res.records[0].get("d").properties;
    device.states = states.length;
    device.sensors = sensors.length;
    device.metrics = metrics.length;

    return device;
  });

  return reduce<IDevice>(device, DataModel.Full);
};

/**
 * @description Read nodes in & reduce to interface
 * @param _id Indexed Node id
 * @param dataModel Interface format; stub, full or private
 */
const read = async <T extends IDevice | IDeviceStub>(
  _id: string,
  dataModel: DataModel.Stub | DataModel.Full = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub: {
      data = await Node.read<IDevice>(_id, NodeType.Device);
      break;
    }

    case DataModel.Full: {
      let res = await cypher(
        ` 
          MATCH (d:Device {_id:$did})
          RETURN d,
            SIZE((d)-[:HAS_PROPERTY]->(:State)) as stateCount,
            SIZE((d)-[:HAS_PROPERTY]->(:Metric)) as metricCount,
            SIZE((d)-[:HAS_PROPERTY]->(:Sensor)) as sensorCount`,
        { did: _id }
      );

      data = res.records[0].get("d").properties;
      data.metrics = res.records[0].get("metricCount").toNumber();
      data.states = res.records[0].get("stateCount").toNumber();
      data.sensors = res.records[0].get("sensorCount").toNumber();
      // data.api_key = await ApiKey.read(_id, DataModel.Stub);

      break;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <T extends IDeviceStub | IDevice>(
  data: T,
  dataModel: DataModel = DataModel.Stub
): T => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IDeviceStub = {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        state: data.state,
        hardware_model: data.hardware_model,
        network_name: data.network_name,
      };
      return r as T;
    }

    case DataModel.Full: {
      let r: IDevice = {
        ...reduce<IDeviceStub>(data, DataModel.Stub),
        images: (<IDevice>data).images,
        device_ip: (<IDevice>data).device_ip,
        software_version: (<IDevice>data).software_version,
        states: (<IDevice>data).states,
        metrics: (<IDevice>data).metrics,
        sensors: (<IDevice>data).sensors,
        api_key: (<IDevice>data).api_key,
        //measurement_count
      };
      return r as T;
    }
  }
};

const remove = async (_id: string, txc?: Transaction) => {
  return sessionable(async (t: Transaction) => {
    let res = await t.run(
      ` MATCH (d:Device {_id:$did})
        MATCH (d)-->(p)
        WHERE p:Metric OR p:State OR p:Sensor
        DETACH DELETE d
        RETURN p{._id, .type}`,
      {
        id: _id,
      }
    );

    // Remove all metrics, states & sensors
    await Promise.all(res.records[0].get("p").map((r: any) => Node.remove(r._id, r.type, t)));
  }, txc);
};

const getState = (device: IDevice): DeviceStateType => {
  if (device.last_ping == undefined) return DeviceStateType.UnVerified;
  if (device.last_ping && device.measurement_count == 0) return DeviceStateType.Verified;
  if (device.last_ping && device.measurement_count > 0) {
    let current_time = Date.now();
    if (current_time - device.last_ping > 86400 * 1000) {
      //1 day
      return DeviceStateType.InActive;
    } else {
      return DeviceStateType.Active;
    }
  }
};

export default { create, read, reduce, remove, getState };
